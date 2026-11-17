import { Select } from '../../components/Field'
import { docTitle } from '../../lib/library'
import type { Doc } from '../../lib/library'

export function DocPicker({ doc, docs, onChange }: { doc: Doc; docs: Doc[]; onChange: (id: string) => void }) {
  return (
    <Select label="Document" hideLabel value={doc.id} onChange={(e) => onChange(e.target.value)} className="w-full sm:w-[320px]">
      {docs.map((d) => (
        <option key={d.id} value={d.id}>
          {docTitle(d)}
        </option>
      ))}
    </Select>
  )
}
