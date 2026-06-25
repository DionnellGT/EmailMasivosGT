import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { campaignSchema, type CampaignFormValues } from '../schemas/campaign.schema'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  defaultValues?: Partial<CampaignFormValues>
  onSubmit: (values: CampaignFormValues) => void
  isLoading?: boolean
}

export function CampaignForm({ defaultValues, onSubmit, isLoading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label>Nombre de campaña</Label>
        <Input {...register('name')} placeholder="Ej: Newsletter Junio" />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>Asunto</Label>
        <Input {...register('subject')} placeholder="Asunto del correo" />
        {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>Cuerpo</Label>
        <textarea
          {...register('body')}
          rows={8}
          className="w-full rounded-md border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Hola {nombre}, ..."
        />
        {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Guardando...' : 'Guardar campaña'}
      </Button>
    </form>
  )
}