import { z } from 'zod'

export const campaignSchema = z.object({
  name:            z.string().min(1, 'Requerido'),
  subject:         z.string().min(1, 'Requerido'),
  body:            z.string().min(10, 'El cuerpo es muy corto'),
  recipientListId: z.string().min(1, 'Selecciona una lista'),
  templateId:      z.string().optional(),
})

export type CampaignFormValues = z.infer<typeof campaignSchema>