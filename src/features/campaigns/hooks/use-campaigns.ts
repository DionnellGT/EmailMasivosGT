import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { api } from '@/shared/api/axios'
import { ENDPOINTS } from '@/shared/api/endpoints'
import type { Campaign } from '@/shared/types'

const QUERY_KEY = ['campaigns']

export function useCampaigns() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => api.get<Campaign[]>(ENDPOINTS.campaigns.list).then((r) => r.data),
  })
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => api.get<Campaign>(ENDPOINTS.campaigns.detail(id)).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Campaign, 'id' | 'createdAt' | 'stats' | 'status'>) =>
      api.post<Campaign>(ENDPOINTS.campaigns.create, data).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEY }); sileo.success({title:'Campaña creada'}) },
    onError: () => sileo.error({title: 'Error al crear la campaña'}),
  })
}

export function useUpdateCampaign(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Campaign>) =>
      api.patch<Campaign>(ENDPOINTS.campaigns.update(id), data).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEY }); qc.invalidateQueries({ queryKey: [...QUERY_KEY, id] }); sileo.success({title: 'Campaña actualizada'}) },
    onError: () => sileo.error({title:'Error al actualizar la campaña'}),
  })
}

export function useDeleteCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(ENDPOINTS.campaigns.delete(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEY }); sileo.success({title: 'Campaña eliminada'}) },
    onError: () => sileo.error({title: 'Error al eliminar'}),
  })
}

export function useSendCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.post(ENDPOINTS.campaigns.send(id)).then((r) => r.data),
    onSuccess: (_, id) => { qc.invalidateQueries({ queryKey: [...QUERY_KEY, id] }); sileo.success({title: 'Campaña enviada correctamente'}) },
    onError: () => sileo.error({title: 'Error al enviar la campaña'}),
  })
}