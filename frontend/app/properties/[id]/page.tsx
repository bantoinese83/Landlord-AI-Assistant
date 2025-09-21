'use client'

import { useParams } from 'next/navigation'
import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import Navbar from '@/components/layout/navbar'
import PropertyDetail from '@/components/properties/property-detail'
import LoadingSpinner from '@/components/ui/loading-spinner'

export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = params.id as string

  const { data: property, isLoading, error } = useQuery(
    ['property', propertyId],
    () => api.get(`/properties/${propertyId}`).then(res => res.data),
    {
      enabled: !!propertyId,
    }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <LoadingSpinner size="lg" text="Loading property details..." />
          </div>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
              <p className="text-gray-600">The property you're looking for doesn't exist or you don't have access to it.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <PropertyDetail property={property} />
        </div>
      </div>
    </div>
  )
}
