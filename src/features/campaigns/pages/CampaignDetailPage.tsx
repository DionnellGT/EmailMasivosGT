import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Send, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCampaign, useSendCampaign, useDeleteCampaign, useCampaignLogs } from '../hooks/use-campaigns'
import type { CampaignStatus } from '@/shared/types'

const statusConfig: Record<CampaignStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft:   { label: 'Borrador',  variant: 'secondary' },
  sending: { label: 'Enviando',  variant: 'default' },
  sent:    { label: 'Enviado',   variant: 'default' },
  failed:  { label: 'Fallido',   variant: 'destructive' },
}

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: campaign, isLoading } = useCampaign(id!)
  const { data: logs = [] } = useCampaignLogs(id!)
  const { mutate: sendCampaign, isPending: isSending } = useSendCampaign()
  const { mutate: deleteCampaign, isPending: isDeleting } = useDeleteCampaign()

  if (isLoading) return (
    <div className="p-6 flex items-center justify-center h-60 text-sm text-muted-foreground">
      Cargando campaña...
    </div>
  )

  if (!campaign) return (
    <div className="p-6 text-sm text-muted-foreground">Campaña no encontrada.</div>
  )

  const cfg = statusConfig[campaign.status]
  const canSend = campaign.status === 'draft' || campaign.status === 'failed'
  const deliveryRate = campaign.totalRecipients > 0
    ? Math.round((campaign.sentCount / campaign.totalRecipients) * 100)
    : 0

  function handleDelete() {
    if (!confirm('¿Eliminar esta campaña?')) return
    deleteCampaign(id!, { onSuccess: () => navigate('/campaigns') })
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/campaigns')}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{campaign.name}</h1>
            <Badge variant={cfg.variant}>{cfg.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{campaign.subject}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 size={14} className="mr-1" /> Eliminar
          </Button>
          {canSend && (
            <Button size="sm" onClick={() => sendCampaign({ id: id! })} disabled={isSending}>
              <Send size={14} className="mr-1" />
              {isSending ? 'Enviando...' : 'Enviar campaña'}
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Total</CardTitle></CardHeader>
          <CardContent><span className="text-2xl font-semibold">{campaign.totalRecipients}</span></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Enviados</CardTitle></CardHeader>
          <CardContent><span className="text-2xl font-semibold text-green-600">{campaign.sentCount}</span></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Fallidos</CardTitle></CardHeader>
          <CardContent><span className="text-2xl font-semibold text-red-500">{campaign.failedCount}</span></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Tasa entrega</CardTitle></CardHeader>
          <CardContent><span className="text-2xl font-semibold">{deliveryRate}%</span></CardContent>
        </Card>
      </div>

      {/* Cuerpo del correo */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Contenido del correo</CardTitle></CardHeader>
        <CardContent>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-sans">
            {campaign.body}
          </pre>
        </CardContent>
      </Card>

      {/* Logs de envío */}
      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Log de envíos ({logs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 text-sm py-1.5 border-b last:border-0">
                  {log.status === 'sent'
                    ? <CheckCircle size={14} className="text-green-500 shrink-0" />
                    : <XCircle size={14} className="text-red-500 shrink-0" />
                  }
                  <span className="flex-1 font-mono text-xs">{log.email}</span>
                  {log.error && (
                    <span className="text-xs text-red-400 truncate max-w-48">{log.error}</span>
                  )}
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(log.sentAt).toLocaleTimeString('es-GT')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
