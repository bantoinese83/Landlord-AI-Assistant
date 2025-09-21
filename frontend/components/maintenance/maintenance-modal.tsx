'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'

const maintenanceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  estimated_cost: z.string().optional(),
  property_id: z.number().min(1, 'Property is required'),
  tenant_id: z.number().optional(),
})

type MaintenanceForm = z.infer<typeof maintenanceSchema>

interface MaintenanceModalProps {
  isOpen: boolean
  onClose: () => void
  request?: any
}

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

export default function MaintenanceModal({ isOpen, onClose, request }: MaintenanceModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const isEditing = !!request

  const { data: properties } = useQuery(
    'properties',
    () => api.get('/properties').then(res => res.data)
  )

  const { data: tenants } = useQuery(
    'tenants',
    () => api.get('/tenants').then(res => res.data)
  )

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MaintenanceForm>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      estimated_cost: '',
      property_id: 0,
      tenant_id: 0,
    },
  })

  const selectedPropertyId = watch('property_id')
  const filteredTenants = tenants?.filter((tenant: any) => 
    tenant.property_id === selectedPropertyId
  ) || []

  useEffect(() => {
    if (request) {
      reset({
        title: request.title || '',
        description: request.description || '',
        priority: request.priority || 'medium',
        estimated_cost: request.estimated_cost || '',
        property_id: request.property_id || 0,
        tenant_id: request.tenant_id || 0,
      })
    } else {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        estimated_cost: '',
        property_id: 0,
        tenant_id: 0,
      })
    }
  }, [request, reset])

  const createMutation = useMutation(
    (data: MaintenanceForm) => api.post('/maintenance', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('maintenance')
        toast.success('Maintenance request created successfully')
        onClose()
      },
      onError: () => {
        toast.error('Failed to create maintenance request')
      },
    }
  )

  const updateMutation = useMutation(
    (data: MaintenanceForm) => api.put(`/maintenance/${request.id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('maintenance')
        toast.success('Maintenance request updated successfully')
        onClose()
      },
      onError: () => {
        toast.error('Failed to update maintenance request')
      },
    }
  )

  const onSubmit = async (data: MaintenanceForm) => {
    setIsLoading(true)
    try {
      const submitData = {
        ...data,
        tenant_id: data.tenant_id || undefined,
      }
      
      if (isEditing) {
        await updateMutation.mutateAsync(submitData)
      } else {
        await createMutation.mutateAsync(submitData)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {isEditing ? 'Edit Maintenance Request' : 'New Maintenance Request'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost btn-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    className="input-primary mt-1"
                    placeholder="Enter maintenance request title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Property *
                  </label>
                  <select {...register('property_id', { valueAsNumber: true })} className="select-primary mt-1">
                    <option value={0}>Select property</option>
                    {properties?.map((property: any) => (
                      <option key={property.id} value={property.id}>
                        {property.name}
                      </option>
                    ))}
                  </select>
                  {errors.property_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.property_id.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tenant (Optional)
                  </label>
                  <select {...register('tenant_id', { valueAsNumber: true })} className="select-primary mt-1">
                    <option value={0}>Select tenant</option>
                    {filteredTenants.map((tenant: any) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Priority *
                  </label>
                  <select {...register('priority')} className="select-primary mt-1">
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                  {errors.priority && (
                    <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="textarea-primary mt-1"
                    placeholder="Describe the maintenance issue in detail"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estimated Cost
                  </label>
                  <input
                    {...register('estimated_cost')}
                    type="text"
                    className="input-primary mt-1"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full sm:w-auto sm:ml-3"
              >
                {isLoading ? 'Saving...' : isEditing ? 'Update Request' : 'Create Request'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
