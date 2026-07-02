import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useImportRecipients } from '../hooks/use-recipients'

export function ImportCsvDialog() {
  const [csv, setCsv] = useState('')
  const [open, setOpen] = useState(false)
  const { mutate: importRecipients, isPending } = useImportRecipients()

  function handleImport() {
    const lines = csv.trim().split('\n').filter(Boolean)
    const recipients = lines
      .filter((line) => !line.startsWith('nombre') && !line.startsWith('name'))
      .map((line) => {
        const [name, email, ...rest] = line.split(',').map((s) => s.trim())
        return { name, email, tags: rest, isActive: true }
      })
      .filter((r) => r.name && r.email)

    if (!recipients.length) return

    importRecipients(recipients, {
      onSuccess: () => {
        setCsv('')
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload size={14} className="mr-2" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Importar destinatarios desde CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <p className="text-xs text-muted-foreground">
            Formato esperado: <code className="bg-muted px-1 py-0.5 rounded">nombre,email,tag1</code>
          </p>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            rows={8}
            className="w-full rounded-md border px-3 py-2 text-sm resize-none font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder={'nombre,email\nJuan García,juan@empresa.com\nAna López,ana@empresa.com'}
          />
          <Button onClick={handleImport} disabled={isPending || !csv.trim()} className="w-full">
            {isPending ? 'Importando...' : 'Importar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
