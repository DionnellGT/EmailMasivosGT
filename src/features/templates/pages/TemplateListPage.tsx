import { useState } from 'react'
import { FileText, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TemplateForm } from '../components/TemplateForm'
import { TemplatePreview } from '../components/TemplatePreview'
import { useTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate } from '../hooks/use-templates'
import type { Template } from '@/shared/types'
import type { TemplateFormValues } from '../schemas/template.schema'

export function TemplateListPage() {
  const { data: templates = [], isLoading } = useTemplates()
  const { mutate: createTemplate, isPending: isCreating } = useCreateTemplate()
  const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteTemplate()

  const [editingTemplate, setEditingTemplate]   = useState<Template | null>(null)
  const [previewTemplate, setPreviewTemplate]   = useState<Template | null>(null)
  const [deletingTemplate, setDeletingTemplate] = useState<Template | null>(null)
  const [createOpen, setCreateOpen]             = useState(false)

  const { mutate: updateTemplate, isPending: isUpdating } = useUpdateTemplate(
    editingTemplate?.id ?? ''
  )

  function handleCreate(values: TemplateFormValues) {
    createTemplate(values, { onSuccess: () => setCreateOpen(false) })
  }

  function handleUpdate(values: TemplateFormValues) {
    updateTemplate(values, { onSuccess: () => setEditingTemplate(null) })
  }

  function handleConfirmDelete() {
    if (!deletingTemplate) return
    deleteTemplate(deletingTemplate.id, {
      onSuccess: () => setDeletingTemplate(null),
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Plantillas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Reutiliza diseños de correo en tus campañas
          </p>
        </div>

        <Sheet open={createOpen} onOpenChange={setCreateOpen}>
          <SheetTrigger asChild>
            <Button size="sm">
              <FileText size={14} className="mr-2" />
              Nueva plantilla
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Nueva plantilla</SheetTitle>
            </SheetHeader>
            <div className="pt-6">
              <TemplateForm onSubmit={handleCreate} isLoading={isCreating} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
          Cargando plantillas...
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 text-sm text-muted-foreground gap-3">
          <FileText size={32} className="opacity-30" />
          <p>No hay plantillas. Crea tu primera plantilla.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setPreviewTemplate(template)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <CardTitle className="text-sm truncate">{template.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {template.subject}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingTemplate(template)
                      }}
                    >
                      <Pencil size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeletingTemplate(template)
                      }}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {template.body}
                </p>
                <Badge variant="secondary" className="mt-3 text-xs">
                  {new Date(template.createdAt).toLocaleDateString('es-GT')}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de confirmación para eliminar */}
      <Dialog
        open={!!deletingTemplate}
        onOpenChange={(open) => !open && setDeletingTemplate(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar plantilla?</DialogTitle>
            <DialogDescription>
              Estás a punto de eliminar{' '}
              <span className="font-medium text-foreground">
                "{deletingTemplate?.name}"
              </span>
              . Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeletingTemplate(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sheet para editar */}
      <Sheet open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Editar plantilla</SheetTitle>
          </SheetHeader>
          <div className="pt-6">
            {editingTemplate && (
              <TemplateForm
                defaultValues={{
                  name:    editingTemplate.name,
                  subject: editingTemplate.subject,
                  body:    editingTemplate.body,
                }}
                onSubmit={handleUpdate}
                isLoading={isUpdating}
                submitLabel="Actualizar plantilla"
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Sheet para preview */}
      <Sheet open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{previewTemplate?.name}</SheetTitle>
          </SheetHeader>
          <div className="pt-6">
            {previewTemplate && (
              <TemplatePreview
                subject={previewTemplate.subject}
                body={previewTemplate.body}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
