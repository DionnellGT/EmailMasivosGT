import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { templateSchema, type TemplateFormValues } from '../schemas/template.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  defaultValues?: Partial<TemplateFormValues>
  onSubmit: (values: TemplateFormValues) => void
  isLoading?: boolean
  submitLabel?: string
}

export function TemplateForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Guardar plantilla' }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label>Nombre de la plantilla</Label>
        <Input {...register('name')} placeholder="Ej: Newsletter mensual" />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>Asunto</Label>
        <Input {...register('subject')} placeholder="Asunto del correo" />
        {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>
          Cuerpo{' '}
          <span className="text-muted-foreground text-xs">
            — usa {'{nombre}'}, {'{empresa}'} como variables
          </span>
        </Label>
        <textarea
          {...register('body')}
          rows={10}
          className="w-full rounded-md border px-3 py-2 text-sm resize-none font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder={'Hola {nombre},\n\nEscribe el contenido aquí...\n\nSaludos,\nEl equipo'}
        />
        {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Guardando...' : submitLabel}
      </Button>
    </form>
  )
}
