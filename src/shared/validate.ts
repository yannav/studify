/*
  Form rules shared by the browser and the Worker, so a message the page shows
  is exactly what the server would answer.
*/

export type Errors = Record<string, string>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateEmail(v: unknown): string | null {
  const s = typeof v === 'string' ? v.trim() : ''
  if (!s) return 'Enter your email address.'
  if (s.length > 200 || !EMAIL.test(s)) return 'Enter a valid email, like you@school.edu.'
  return null
}

export function validateLogin(b: { email?: unknown; password?: unknown }): Errors {
  const e: Errors = {}
  const email = validateEmail(b.email)
  if (email) e.email = email
  if (typeof b.password !== 'string' || !b.password) e.password = 'Enter your password.'
  return e
}

export const LEVELS = ['High school', 'University', 'Postgraduate', 'Professional exam'] as const

export function validateSignup(b: { name?: unknown; email?: unknown; password?: unknown; level?: unknown; terms?: unknown }): Errors {
  const e: Errors = {}
  const name = typeof b.name === 'string' ? b.name.trim() : ''
  if (!name) e.name = 'Tell us what to call you.'
  else if (name.length > 80) e.name = 'Keep it under 80 characters.'
  const email = validateEmail(b.email)
  if (email) e.email = email
  const pw = typeof b.password === 'string' ? b.password : ''
  if (pw.length < 8) e.password = 'Use at least 8 characters.'
  else if (!/[0-9]/.test(pw) || !/[a-zA-Z]/.test(pw)) e.password = 'Mix letters and at least one number.'
  if (!LEVELS.includes(b.level as (typeof LEVELS)[number])) e.level = 'Choose where you study.'
  if (b.terms !== true) e.terms = 'Accept the terms to continue.'
  return e
}

export function validateContact(b: { name?: unknown; email?: unknown; message?: unknown }): Errors {
  const e: Errors = {}
  const name = typeof b.name === 'string' ? b.name.trim() : ''
  if (!name) e.name = 'Enter your name.'
  const email = validateEmail(b.email)
  if (email) e.email = email
  const msg = typeof b.message === 'string' ? b.message.trim() : ''
  if (msg.length < 10) e.message = 'Write at least 10 characters.'
  else if (msg.length > 2000) e.message = 'Keep it under 2,000 characters.'
  return e
}

export const ACCEPTED = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'txt', 'md', 'ppt', 'pptx'] as const
export const MAX_BYTES = 25 * 1024 * 1024

export function fileKind(name: string): 'pdf' | 'doc' | 'png' | 'txt' | 'ppt' {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'pdf') return 'pdf'
  if (ext === 'doc' || ext === 'docx') return 'doc'
  if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'png'
  if (ext === 'ppt' || ext === 'pptx') return 'ppt'
  return 'txt'
}

export function validateUpload(b: { name?: unknown; size?: unknown }): string | null {
  const name = typeof b.name === 'string' ? b.name.trim() : ''
  if (!name) return 'Choose a file to upload.'
  if (name.length > 180) return 'That file name is too long.'
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (!name.includes('.') || !ACCEPTED.includes(ext as (typeof ACCEPTED)[number])) return 'Cramly reads PDF, Word, PowerPoint, images and text files.'
  const size = typeof b.size === 'number' ? b.size : -1
  if (!Number.isFinite(size) || size <= 0) return 'That file looks empty.'
  if (size > MAX_BYTES) return 'Files can be up to 25 MB on the free plan.'
  return null
}

export function validateQuestion(v: unknown): string | null {
  const s = typeof v === 'string' ? v.trim() : ''
  if (!s) return 'Ask a question first.'
  if (s.length > 600) return 'Keep questions under 600 characters.'
  return null
}
