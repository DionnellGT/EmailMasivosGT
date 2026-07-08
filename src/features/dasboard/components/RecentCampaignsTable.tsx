import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/shared/components/data-table/DataTable'
import type { Campaign, CampaignStatus } from '@/shared/types'

const statusConfig: Record<CampaignStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft:     { label: 'Borrador',   variant: 'secondary' },
  scheduled: { label: 'Programado', variant: 'outline' },
  sending:   { label: 'Enviando',   variant: 'default' },
  sent:      { label: 'Enviado',    variant: 'default' },
  failed:    { label: 'Fallido',    variant: 'destructive' },
}
 
export function RecentCampaignsTable({ campaigns, isLoading }: { campaigns: Campaign[]; isLoading?: boolean }) {
  return (
    <DataTable
      data={campaigns}
      isLoading={isLoading}
      emptyMessage="No hay campañas recientes"
      columns={[
        { key: 'name', label: 'Campaña' },
        { key: 'subject', label: 'Asunto' },
        { key: 'status', label: 'Estado', render: (row) => { const cfg = statusConfig[row.status]; return <Badge variant={cfg.variant}>{cfg.label}</Badge> } },
        { key: 'stats',  label: 'Enviados', render: (row) => `${row.stats.sent} / ${row.stats.total}` },
        { key: 'createdAt', label: 'Fecha', render: (row) => new Date(row.createdAt).toLocaleDateString('es-GT') },
      ]}
    />
  )
}