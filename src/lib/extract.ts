import { unzipSync } from 'fflate'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

import { MAX_TEXT, MIN_TEXT } from '../shared/validate'

/*
  Reading the file the student actually picked, in the browser.

  Text and Markdown are read directly, PDFs with pdf.js, .docx/.pptx by
  unzipping the Office package and keeping the text runs. Everything happens
  locally; only the extracted text is posted to the Worker. Files this demo
  cannot read (images: no OCR, old binary .doc/.ppt) fail with a message that
  says so instead of inventing a study pack.
*/

/** A file the app can't turn into text, with a message safe to show the user. */
export class ReadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ReadError'
  }
}

const MSG = {
  image: 'Studify can’t read images yet. Upload a PDF, Word or PowerPoint file, or save your notes as text.',
  scanned: 'That PDF has no text in it — it looks like a scan. Try a text-based PDF or a Word file.',
  damaged: 'That PDF is damaged or password-protected, so we couldn’t read it.',
  doc: 'This is an old .doc file. Save it as .docx or PDF and try again.',
  ppt: 'This is an old .ppt file. Save it as .pptx or PDF and try again.',
  empty: 'There wasn’t enough text in that file to build a pack. Try a longer file.',
  generic: 'We couldn’t read that file. Try saving it again, or upload a PDF or text file.',
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

/** Text runs from a Word or PowerPoint XML part. */
function xmlText(xml: string): string {
  return xml
    .replace(/<\/[wa]:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, code: string) =>
      code.startsWith('#')
        ? String.fromCodePoint(parseInt(code[1] === 'x' || code[1] === 'X' ? code.slice(2) : code.slice(1), 16) || 0)
        : ENTITIES[code.toLowerCase()] ?? m,
    )
}

const decoder = new TextDecoder()

async function unzip(file: File): Promise<Record<string, Uint8Array>> {
  return unzipSync(new Uint8Array(await file.arrayBuffer()))
}

async function pdfText(file: File, pdfjs: typeof import('pdfjs-dist')): Promise<string> {
  if (!pdfjs.GlobalWorkerOptions.workerSrc) pdfjs.GlobalWorkerOptions.workerSrc = workerSrc
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) })
  let doc
  try {
    doc = await task.promise
  } catch {
    throw new ReadError(MSG.damaged)
  }
  try {
    const pages: string[] = []
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n)
      const content = await page.getTextContent()
      // Keep the PDF's own line breaks: headings otherwise run into the next sentence.
      pages.push(content.items.map((item) => ('str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '')).join(''))
    }
    const text = pages.join('\n')
    if (text.replace(/\s+/g, '').length < MIN_TEXT / 4) throw new ReadError(MSG.scanned)
    return text
  } finally {
    await task.destroy()
  }
}

async function docxText(file: File): Promise<string> {
  let part: Uint8Array | undefined
  try {
    part = (await unzip(file))['word/document.xml']
  } catch {
    throw new ReadError(MSG.doc)
  }
  if (!part) throw new ReadError(MSG.doc)
  return xmlText(decoder.decode(part))
}

async function pptxText(file: File): Promise<string> {
  let files: Record<string, Uint8Array>
  try {
    files = await unzip(file)
  } catch {
    throw new ReadError(MSG.ppt)
  }
  const slides = Object.keys(files)
    .filter((p) => /^ppt\/slides\/slide\d+\.xml$/.test(p))
    .sort((a, b) => Number(a.match(/\d+/)![0]) - Number(b.match(/\d+/)![0]))
  if (!slides.length) throw new ReadError(MSG.ppt)
  return slides.map((p) => xmlText(decoder.decode(files[p]))).join('\n')
}

/** True for a zip (an Office file saved with the wrong extension). */
async function isZip(file: File) {
  const head = new Uint8Array(await file.slice(0, 2).arrayBuffer())
  return head[0] === 0x50 && head[1] === 0x4b
}

/**
 * The file's text, trimmed to what the analyzer needs.
 * Throws `ReadError` with a user-facing message when the file can't be read.
 */
export async function extractText(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  let text: string
  try {
    if (ext === 'txt' || ext === 'md') text = await file.text()
    else if (ext === 'pdf') text = await pdfText(file, await import('pdfjs-dist'))
    else if (ext === 'docx') text = await docxText(file)
    else if (ext === 'pptx') text = await pptxText(file)
    else if (ext === 'doc') text = (await isZip(file)) ? await docxText(file) : ''
    else if (ext === 'ppt') text = (await isZip(file)) ? await pptxText(file) : ''
    else if (['png', 'jpg', 'jpeg'].includes(ext)) throw new ReadError(MSG.image)
    else throw new ReadError(MSG.generic)
  } catch (e) {
    if (e instanceof ReadError) throw e
    throw new ReadError(MSG.generic)
  }

  if (ext === 'doc' && !text) throw new ReadError(MSG.doc)
  if (ext === 'ppt' && !text) throw new ReadError(MSG.ppt)
  const trimmed = text.replace(/[ \t\u00a0]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
  if (trimmed.replace(/\s+/g, '').length < MIN_TEXT) throw new ReadError(MSG.empty)
  return trimmed.slice(0, MAX_TEXT)
}
