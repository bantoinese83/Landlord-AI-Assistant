'use client'

import Link from 'next/link'
import { Building2, MapPin } from 'lucide-react'

interface RecentPropertiesProps {
  properties: any[]
  isLoading: boolean
}

export default function RecentProperties({ properties, isLoading }: RecentPropertiesProps) {
  if (isLoading) {
    return (
      <div className="card-primary p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Properties</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const recentProperties = properties?.slice(0, 5) || []

  return (
    <div className="card-primary p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Properties</h3>
        <Link href="/properties" className="text-sm text-primary-600 hover:text-primary-500">
          View all
        </Link>
      </div>
      
      {recentProperties.length === 0 ? (
        <div className="text-center py-6">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No properties yet</p>
          <Link href="/properties" className="btn btn-primary btn-sm mt-2">
            Add Property
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recentProperties.map((property) => (
            <div key={property.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {property.name}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="truncate">
                    {property.city}, {property.state}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 text-sm text-gray-500">
                ${property.rent_amount.toLocaleString()}/mo
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
