import { Building2, MapPin, DollarSign, Users, Edit, Trash2 } from 'lucide-react'

interface PropertyCardProps {
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
    tenants?: any[]
  }
  onEdit: (property: any) => void
  onDelete: (id: number) => void
}

export default function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  const tenantCount = property.tenants?.length || 0

  return (
    <div className="card-primary p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <Building2 className="w-8 h-8 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{property.property_type}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(property)}
            className="btn btn-ghost btn-sm"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(property.id)}
            className="btn btn-ghost btn-sm text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="truncate">
            {property.address}, {property.city}, {property.state} {property.zip_code}
          </span>
        </div>

        {(property.bedrooms || property.bathrooms || property.square_feet) && (
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {property.bedrooms && (
              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
            )}
            {property.bathrooms && (
              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
            )}
            {property.square_feet && (
              <span>{property.square_feet.toLocaleString()} sq ft</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className="font-semibold text-lg text-gray-900">
              ${property.rent_amount.toLocaleString()}
            </span>
            <span className="ml-1">/mo</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            <span>{tenantCount} tenant{tenantCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {property.deposit_amount && (
          <div className="text-sm text-gray-600">
            Deposit: ${property.deposit_amount.toLocaleString()}
          </div>
        )}

        {property.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {property.description}
          </p>
        )}
      </div>
    </div>
  )
}
