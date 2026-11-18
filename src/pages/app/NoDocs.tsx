import { FileUp } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../../components/Button'
import { EmptyState } from '../../components/EmptyState'
import { useT } from '../../lib/i18n'
import { UploadDialog } from '../../components/UploadDialog'

export function NoDocs({ what }: { what: string }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <EmptyState
        icon={<FileUp className="size-6" />}
        title={t('Your library is empty')}
        body={t('Upload a file and Studify will build {what} from it in about ten seconds.', { what: t(what) })}
        action={
          <Button variant="paper" onClick={() => setOpen(true)}>
            {t('Upload a file')}
          </Button>
        }
      />
      <UploadDialog open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
