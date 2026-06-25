import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/shared/api/axios'
import { ENDPOINTS } from '@/shared/api/endpoints'
import type { Campaign } from '@/shared/types'


const QUERY_KEY = ['campaigns']

// ---------- queries ----------
export function useCampaigns() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => api.get<Campaign[]>(ENDPOINTS.campaigns.list).then(r => r.data),
  })
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => api.get<Campaign>(ENDPOINTS.campaigns.detail(id)).then(r => r.data),
    enabled: !!id,
  })
}

// ---------- mutations ----------
export function useCreateCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Campaign, 'id' | 'createdAt' | 'stats' | 'status'>) =>
      api.post<Campaign>(ENDPOINTS.campaigns.create, data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Campaña creada')
    },
    onError: () => toast.error('Error al crear la campaña'),
  })
}

export function useSendCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.post(ENDPOINTS.campaigns.send(id)).then(r => r.data),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, id] })
      toast.success('Campaña enviada')
    },
    onError: () => toast.error('Error al enviar'),
  })
}