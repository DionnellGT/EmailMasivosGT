export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'

export interface Campaign {
  id: string
  name: string
  subject: string
  body: string
  status: CampaignStatus
  recipientListId: string
  templateId?: string
  sentAt?: string
  createdAt: string
  stats: { total: number; sent: number; failed: number }
}

export interface Recipient {
  id: string
  name: string
  email: string
  tags?: string[]
  createdAt: string
}

export interface RecipientList {
  id: string
  name: string
  count: number
  createdAt: string
}

export interface Template {
  id: string
  name: string
  subject: string
  body: string
  createdAt: string
}

export interface DashboardMetrics {
  totalSent: number
  totalCampaigns: number
  avgOpenRate: number
  avgDeliveryRate: number
  recentCampaigns: Campaign[]
}