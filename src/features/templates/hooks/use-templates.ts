import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sileo'
import { api } from '@/shared/api/axios'
import { ENDPOINTS } from '@/shared/api/endpoints'
import type { Template } from '@/shared/types'

const QUERY_KEY = ['templates']

export function useTemplates() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => api.get<Template[]>(ENDPOINTS.templates.list).then((r) => r.data),
  })
}

export function useCreateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Template, 'id' | 'createdAt'>) =>
      api.post<Template>(ENDPOINTS.templates.create, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Plantilla creada')
    },
    onError: () => toast.error('Error al crear la plantilla'),
  })
}

export function useUpdateTemplate(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Template>) =>
      api.patch<Template>(ENDPOINTS.templates.update(id), data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Plantilla actualizada')
    },
    onError: () => toast.error('Error al actualizar'),
  })
}
