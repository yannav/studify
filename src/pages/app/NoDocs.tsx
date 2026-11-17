import { FileUp } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../../components/Button'
import { EmptyState } from '../../components/EmptyState'
import { UploadDialog } from '../../components/UploadDialog'

export function NoDocs({ what }: { what: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <EmptyState
        icon={<FileUp className="size-6" />}
        title="Your library is empty"
        body={`Upload a file and Cramly will build ${what} from it in about ten seconds.`}
        action={
          <Button variant="paper" onClick={() => setOpen(true)}>
            Upload a file
          </Button>
        }
      />
      <UploadDialog open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
