import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sileo'
import { api } from '@/shared/api/axios'
import { ENDPOINTS } from '@/shared/api/endpoints'
import type { Recipient } from '@/shared/types'

const QUERY_KEY = ['recipients']

export function useRecipients() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => api.get<Recipient[]>(ENDPOINTS.recipients.list).then((r) => r.data),
  })
}

export function useCreateRecipient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Recipient, 'id' | 'createdAt'>) =>
      api.post<Recipient>(ENDPOINTS.recipients.create, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Destinatario agregado')
    },
    onError: () => toast.error('Error al agregar destinatario'),
  })
}

export function useDeleteRecipient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(ENDPOINTS.recipients.delete(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Destinatario eliminado')
    },
    onError: () => toast.error('Error al eliminar'),
  })
}

export function useImportRecipients() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (recipients: Omit<Recipient, 'id' | 'createdAt'>[]) =>
      api.post(ENDPOINTS.recipients.import, { recipients }).then((r) => r.data),
    onSuccess: (data: { imported: number }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success(`${data.imported} destinatarios importados`)
    },
    onError: () => toast.error('Error al importar CSV'),
  })
}
