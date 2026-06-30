import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
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
      sileo.success({title: 'Destinatario agregado'})
    },
    onError: () => sileo.error({title: 'Error al agregar destinatario'}),
  })
}

export function useDeleteRecipient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(ENDPOINTS.recipients.delete(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      sileo.success({title: 'Destinatario eliminado'})
    },
    onError: () => sileo.error({title: 'Error al eliminar'}),
  })
}

export function useImportRecipients() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (recipients: Omit<Recipient, 'id' | 'createdAt'>[]) =>
      api.post(ENDPOINTS.recipients.import, { recipients }).then((r) => r.data),
    onSuccess: (data: { imported: number }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      sileo.success({title: `${data.imported} destinatarios importados`})
    },
    onError: () => sileo.error({title: 'Error al importar CSV'}),
  })
}
