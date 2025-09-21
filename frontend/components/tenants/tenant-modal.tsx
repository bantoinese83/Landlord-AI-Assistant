'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'

const tenantSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  lease_start_date: z.string().min(1, 'Lease start date is required'),
  lease_end_date: z.string().min(1, 'Lease end date is required'),
  monthly_rent: z.string().min(1, 'Monthly rent is required'),
  security_deposit: z.string().optional(),
  notes: z.string().optional(),
  property_id: z.number().min(1, 'Property is required'),
})

type TenantForm = z.infer<typeof tenantSchema>

interface TenantModalProps {
  isOpen: boolean
  onClose: () => void
  tenant?: any
}

export default function TenantModal({ isOpen, onClose, tenant }: TenantModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const isEditing = !!tenant

  const { data: properties } = useQuery(
    'properties',
    () => api.get('/properties').then(res => res.data)
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TenantForm>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      lease_start_date: '',
      lease_end_date: '',
      monthly_rent: '',
      security_deposit: '',
      notes: '',
      property_id: 0,
    },
  })

  useEffect(() => {
    if (tenant) {
      reset({
        full_name: tenant.full_name || '',
        email: tenant.email || '',
        phone: tenant.phone || '',
        emergency_contact_name: tenant.emergency_contact_name || '',
        emergency_contact_phone: tenant.emergency_contact_phone || '',
        lease_start_date: tenant.lease_start_date || '',
        lease_end_date: tenant.lease_end_date || '',
        monthly_rent: tenant.monthly_rent || '',
        security_deposit: tenant.security_deposit || '',
        notes: tenant.notes || '',
        property_id: tenant.property_id || 0,
      })
    } else {
      reset({
        full_name: '',
        email: '',
        phone: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        lease_start_date: '',
        lease_end_date: '',
        monthly_rent: '',
        security_deposit: '',
        notes: '',
        property_id: 0,
      })
    }
  }, [tenant, reset])

  const createMutation = useMutation(
    (data: TenantForm) => api.post('/tenants', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tenants')
        toast.success('Tenant created successfully')
        onClose()
      },
      onError: () => {
        toast.error('Failed to create tenant')
      },
    }
  )

  const updateMutation = useMutation(
    (data: TenantForm) => api.put(`/tenants/${tenant.id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tenants')
        toast.success('Tenant updated successfully')
        onClose()
      },
      onError: () => {
        toast.error('Failed to update tenant')
      },
    }
  )

  const onSubmit = async (data: TenantForm) => {
    setIsLoading(true)
    try {
      if (isEditing) {
        await updateMutation.mutateAsync(data)
      } else {
        await createMutation.mutateAsync(data)
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
                  {isEditing ? 'Edit Tenant' : 'Add New Tenant'}
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
                    Full Name *
                  </label>
                  <input
                    {...register('full_name')}
                    type="text"
                    className="input-primary mt-1"
                    placeholder="Enter full name"
                  />
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="input-primary mt-1"
                      placeholder="Enter email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="input-primary mt-1"
                      placeholder="Enter phone"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Lease Start Date *
                    </label>
                    <input
                      {...register('lease_start_date')}
                      type="date"
                      className="input-primary mt-1"
                    />
                    {errors.lease_start_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.lease_start_date.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Lease End Date *
                    </label>
                    <input
                      {...register('lease_end_date')}
                      type="date"
                      className="input-primary mt-1"
                    />
                    {errors.lease_end_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.lease_end_date.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Monthly Rent *
                    </label>
                    <input
                      {...register('monthly_rent')}
                      type="text"
                      className="input-primary mt-1"
                      placeholder="0.00"
                    />
                    {errors.monthly_rent && (
                      <p className="mt-1 text-sm text-red-600">{errors.monthly_rent.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Security Deposit
                    </label>
                    <input
                      {...register('security_deposit')}
                      type="text"
                      className="input-primary mt-1"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Emergency Contact Name
                    </label>
                    <input
                      {...register('emergency_contact_name')}
                      type="text"
                      className="input-primary mt-1"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Emergency Contact Phone
                    </label>
                    <input
                      {...register('emergency_contact_phone')}
                      type="tel"
                      className="input-primary mt-1"
                      placeholder="Enter phone"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="textarea-primary mt-1"
                    placeholder="Enter any additional notes"
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
                {isLoading ? 'Saving...' : isEditing ? 'Update Tenant' : 'Create Tenant'}
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
