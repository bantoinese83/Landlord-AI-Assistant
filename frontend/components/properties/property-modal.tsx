'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from 'react-query'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'

const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip_code: z.string().min(1, 'ZIP code is required'),
  property_type: z.string().min(1, 'Property type is required'),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  square_feet: z.number().optional(),
  rent_amount: z.number().min(0, 'Rent amount must be positive'),
  deposit_amount: z.number().optional(),
  description: z.string().optional(),
})

type PropertyForm = z.infer<typeof propertySchema>

interface PropertyModalProps {
  isOpen: boolean
  onClose: () => void
  property?: any
}

const propertyTypes = [
  'Apartment',
  'House',
  'Condo',
  'Townhouse',
  'Duplex',
  'Studio',
  'Other'
]

export default function PropertyModal({ isOpen, onClose, property }: PropertyModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const isEditing = !!property

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyForm>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      property_type: '',
      bedrooms: undefined,
      bathrooms: undefined,
      square_feet: undefined,
      rent_amount: 0,
      deposit_amount: undefined,
      description: '',
    },
  })

  useEffect(() => {
    if (property) {
      reset({
        name: property.name || '',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zip_code: property.zip_code || '',
        property_type: property.property_type || '',
        bedrooms: property.bedrooms || undefined,
        bathrooms: property.bathrooms || undefined,
        square_feet: property.square_feet || undefined,
        rent_amount: property.rent_amount || 0,
        deposit_amount: property.deposit_amount || undefined,
        description: property.description || '',
      })
    } else {
      reset({
        name: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        property_type: '',
        bedrooms: undefined,
        bathrooms: undefined,
        square_feet: undefined,
        rent_amount: 0,
        deposit_amount: undefined,
        description: '',
      })
    }
  }, [property, reset])

  const createMutation = useMutation(
    (data: PropertyForm) => api.post('/properties', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('properties')
        toast.success('Property created successfully')
        onClose()
      },
      onError: () => {
        toast.error('Failed to create property')
      },
    }
  )

  const updateMutation = useMutation(
    (data: PropertyForm) => api.put(`/properties/${property.id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('properties')
        toast.success('Property updated successfully')
        onClose()
      },
      onError: () => {
        toast.error('Failed to update property')
      },
    }
  )

  const onSubmit = async (data: PropertyForm) => {
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
                  {isEditing ? 'Edit Property' : 'Add New Property'}
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
                    Property Name *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="input-primary mt-1"
                    placeholder="Enter property name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <input
                    {...register('address')}
                    type="text"
                    className="input-primary mt-1"
                    placeholder="Enter full address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      className="input-primary mt-1"
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      State *
                    </label>
                    <input
                      {...register('state')}
                      type="text"
                      className="input-primary mt-1"
                      placeholder="State"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ZIP Code *
                  </label>
                  <input
                    {...register('zip_code')}
                    type="text"
                    className="input-primary mt-1"
                    placeholder="ZIP code"
                  />
                  {errors.zip_code && (
                    <p className="mt-1 text-sm text-red-600">{errors.zip_code.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Property Type *
                  </label>
                  <select {...register('property_type')} className="select-primary mt-1">
                    <option value="">Select property type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.property_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.property_type.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bedrooms
                    </label>
                    <input
                      {...register('bedrooms', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="input-primary mt-1"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bathrooms
                    </label>
                    <input
                      {...register('bathrooms', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.5"
                      className="input-primary mt-1"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Square Feet
                    </label>
                    <input
                      {...register('square_feet', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="input-primary mt-1"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Monthly Rent *
                    </label>
                    <input
                      {...register('rent_amount', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.01"
                      className="input-primary mt-1"
                      placeholder="0.00"
                    />
                    {errors.rent_amount && (
                      <p className="mt-1 text-sm text-red-600">{errors.rent_amount.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Security Deposit
                    </label>
                    <input
                      {...register('deposit_amount', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.01"
                      className="input-primary mt-1"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="textarea-primary mt-1"
                    placeholder="Enter property description"
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
                {isLoading ? 'Saving...' : isEditing ? 'Update Property' : 'Create Property'}
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
