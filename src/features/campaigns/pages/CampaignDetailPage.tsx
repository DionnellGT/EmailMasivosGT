import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Send, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCampaign, useSendCampaign, useDeleteCampaign } from '../hooks/use-campaigns'
import type { CampaignStatus } from '@/shared/types'

const statusConfig: Record<CampaignStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft:     { label: 'Borrador',   variant: 'secondary' },
  scheduled: { label: 'Programado', variant: 'outline' },
  sending:   { label: 'Enviando',   variant: 'default' },
  sent:      { label: 'Enviado',    variant: 'default' },
  failed:    { label: 'Fallido',    variant: 'destructive' },
}

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: campaign, isLoading } = useCampaign(id!)
  const { mutate: sendCampaign, isPending: isSending } = useSendCampaign()
  const { mutate: deleteCampaign, isPending: isDeleting } = useDeleteCampaign()

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-60 text-sm text-muted-foreground">
        Cargando campaña...
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Campaña no encontrada.
      </div>
    )
  }

  const cfg = statusConfig[campaign.status]
  const canSend = campaign.status === 'draft' || campaign.status === 'failed'

  function handleDelete() {
    if (!confirm('¿Eliminar esta campaña?')) return
    deleteCampaign(id!, { onSuccess: () => navigate('/campaigns') })
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/campaigns')}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{campaign.name}</h1>
            <Badge variant={cfg.variant}>{cfg.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{campaign.subject}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 size={14} className="mr-1" />
            Eliminar
          </Button>
          {canSend && (
            <Button
              size="sm"
              onClick={() => sendCampaign(id!)}
              disabled={isSending}
            >
              <Send size={14} className="mr-1" />
              {isSending ? 'Enviando...' : 'Enviar campaña'}
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Total destinatarios</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold">{campaign.stats.total}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold text-green-600">{campaign.stats.sent}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Fallidos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold text-red-500">{campaign.stats.failed}</span>
          </CardContent>
        </Card>
      </div>

      {/* Body preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Contenido del correo</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-sans">
            {campaign.body}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
