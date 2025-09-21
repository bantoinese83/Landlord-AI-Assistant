'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'

const rentSchema = z.object({
  amount: z.number().min(0, 'Amount must be positive'),
  due_date: z.string().min(1, 'Due date is required'),
  paid_date: z.string().optional(),
  status: z.enum(['pending', 'paid', 'overdue', 'partial', 'cancelled']),
  payment_method: z.enum(['cash', 'check', 'bank_transfer', 'online', 'other']).optional(),
  reference_number: z.string().optional(),
  notes: z.string().optional(),
  property_id: z.number().min(1, 'Property is required'),
  tenant_id: z.number().min(1, 'Tenant is required'),
})

type RentForm = z.infer<typeof rentSchema>

interface RentModalProps {
  isOpen: boolean
  onClose: () => void
  payment?: any
}

const statuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'partial', label: 'Partial' },
  { value: 'cancelled', label: 'Cancelled' },
]

const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'online', label: 'Online' },
  { value: 'other', label: 'Other' },
]

export default function RentModal({ isOpen, onClose, payment }: RentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const isEditing = !!payment

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
  } = useForm<RentForm>({
    resolver: zodResolver(rentSchema),
    defaultValues: {
      amount: 0,
      due_date: '',
      paid_date: '',
      status: 'pending',
      payment_method: 'cash',
      reference_number: '',
      notes: '',
      property_id: 0,
      tenant_id: 0,
    },
  })

  const selectedPropertyId = watch('property_id')
  const filteredTenants = tenants?.filter((tenant: any) => 
    tenant.property_id === selectedPropertyId
  ) || []

  useEffect(() => {
    if (payment) {
      reset({
        amount: payment.amount || 0,
        due_date: payment.due_date || '',
        paid_date: payment.paid_date || '',
        status: payment.status || 'pending',
        payment_method: payment.payment_method || 'cash',
        reference_number: payment.reference_number || '',
        notes: payment.notes || '',
        property_id: payment.property_id || 0,
        tenant_id: payment.tenant_id || 0,
      })
    } else {
      reset({
        amount: 0,
        due_date: '',
        paid_date: '',
        status: 'pending',
        payment_method: 'cash',
        reference_number: '',
        notes: '',
        property_id: 0,
        tenant_id: 0,
      })
    }
  }, [payment, reset])

  const createMutation = useMutation(
    (data: RentForm) => api.post('/rent', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rent')
        toast.success('Rent payment recorded successfully')
        onClose()
      },
      onError: () => {
        toast.error('Failed to record rent payment')
      },
    }
  )

  const updateMutation = useMutation(
    (data: RentForm) => api.put(`/rent/${payment.id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rent')
        toast.success('Rent payment updated successfully')
        onClose()
      },
      onError: () => {
        toast.error('Failed to update rent payment')
      },
    }
  )

  const onSubmit = async (data: RentForm) => {
    setIsLoading(true)
    try {
      const submitData = {
        ...data,
        paid_date: data.paid_date || undefined,
        payment_method: data.payment_method || undefined,
        reference_number: data.reference_number || undefined,
        notes: data.notes || undefined,
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
                  {isEditing ? 'Edit Rent Payment' : 'Record Rent Payment'}
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
                    Tenant *
                  </label>
                  <select {...register('tenant_id', { valueAsNumber: true })} className="select-primary mt-1">
                    <option value={0}>Select tenant</option>
                    {filteredTenants.map((tenant: any) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.full_name}
                      </option>
                    ))}
                  </select>
                  {errors.tenant_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.tenant_id.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount *
                  </label>
                  <input
                    {...register('amount', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    step="0.01"
                    className="input-primary mt-1"
                    placeholder="0.00"
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Due Date *
                    </label>
                    <input
                      {...register('due_date')}
                      type="date"
                      className="input-primary mt-1"
                    />
                    {errors.due_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Paid Date
                    </label>
                    <input
                      {...register('paid_date')}
                      type="date"
                      className="input-primary mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status *
                    </label>
                    <select {...register('status')} className="select-primary mt-1">
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <select {...register('payment_method')} className="select-primary mt-1">
                      {paymentMethods.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reference Number
                  </label>
                  <input
                    {...register('reference_number')}
                    type="text"
                    className="input-primary mt-1"
                    placeholder="Enter reference number"
                  />
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
                {isLoading ? 'Saving...' : isEditing ? 'Update Payment' : 'Record Payment'}
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
