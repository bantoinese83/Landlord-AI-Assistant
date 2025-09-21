import { Building2, MapPin, DollarSign, Users, Calendar, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface PropertyDetailProps {
  property: {
    id: number
    name: string
    address: string
    city: string
    state: string
    zip_code: string
    property_type: string
    bedrooms?: number
    bathrooms?: number
    square_feet?: number
    rent_amount: number
    deposit_amount?: number
    description?: string
    is_active: boolean
    created_at: string
    updated_at?: string
    tenants?: any[]
    maintenance_requests?: any[]
    rent_payments?: any[]
  }
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const tenantCount = property.tenants?.length || 0
  const activeMaintenance = property.maintenance_requests?.filter(req => req.status === 'pending' || req.status === 'in_progress').length || 0
  const totalRent = property.rent_payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
          <p className="text-lg text-gray-600 capitalize">{property.property_type}</p>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/properties`}
            className="btn btn-secondary"
          >
            Back to Properties
          </Link>
        </div>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-primary p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3" />
                <span>{property.address}, {property.city}, {property.state} {property.zip_code}</span>
              </div>

              {(property.bedrooms || property.bathrooms || property.square_feet) && (
                <div className="grid grid-cols-3 gap-4">
                  {property.bedrooms && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                      <p className="text-sm text-gray-600">Bedrooms</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                      <p className="text-sm text-gray-600">Bathrooms</p>
                    </div>
                  )}
                  {property.square_feet && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{property.square_feet.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Sq Ft</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between py-3 border-t border-gray-200">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span className="text-lg font-semibold text-gray-900">
                    ${property.rent_amount.toLocaleString()}
                  </span>
                  <span className="ml-1">/month</span>
                </div>
                {property.deposit_amount && (
                  <div className="text-gray-600">
                    Deposit: ${property.deposit_amount.toLocaleString()}
                  </div>
                )}
              </div>

              {property.description && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{property.description}</p>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Added on {format(new Date(property.created_at), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="card-primary p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-600">Tenants</span>
                </div>
                <span className="font-semibold text-gray-900">{tenantCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-gray-600">Active Maintenance</span>
                </div>
                <span className="font-semibold text-gray-900">{activeMaintenance}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-gray-600">Total Rent Collected</span>
                </div>
                <span className="font-semibold text-gray-900">${totalRent.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="card-primary p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-2">
              <Link
                href={`/tenants?property=${property.id}`}
                className="btn btn-secondary w-full"
              >
                View Tenants
              </Link>
              <Link
                href={`/maintenance?property=${property.id}`}
                className="btn btn-secondary w-full"
              >
                View Maintenance
              </Link>
              <Link
                href={`/rent?property=${property.id}`}
                className="btn btn-secondary w-full"
              >
                View Rent Payments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
