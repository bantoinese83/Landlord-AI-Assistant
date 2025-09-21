import { User, Mail, Phone, Calendar, DollarSign, Edit, Trash2, Building2 } from 'lucide-react'
import { format } from 'date-fns'

interface TenantCardProps {
  tenant: {
    id: number
    full_name: string
    email?: string
    phone?: string
    emergency_contact_name?: string
    emergency_contact_phone?: string
    lease_start_date: string
    lease_end_date: string
    monthly_rent: string
    security_deposit?: string
    notes?: string
    property?: {
      name: string
    }
  }
  onEdit: (tenant: any) => void
  onDelete: (id: number) => void
}

export default function TenantCard({ tenant, onEdit, onDelete }: TenantCardProps) {
  const isLeaseExpired = new Date(tenant.lease_end_date) < new Date()
  const isLeaseExpiringSoon = new Date(tenant.lease_end_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  return (
    <div className={`card-primary p-6 hover:shadow-xl transition-shadow ${
      isLeaseExpired ? 'border-red-200 bg-red-50' : 
      isLeaseExpiringSoon ? 'border-yellow-200 bg-yellow-50' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <User className="w-8 h-8 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{tenant.full_name}</h3>
            {tenant.property && (
              <p className="text-sm text-gray-500 flex items-center">
                <Building2 className="w-4 h-4 mr-1" />
                {tenant.property.name}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(tenant)}
            className="btn btn-ghost btn-sm"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(tenant.id)}
            className="btn btn-ghost btn-sm text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {tenant.email && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            <span className="truncate">{tenant.email}</span>
          </div>
        )}

        {tenant.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>{tenant.phone}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {format(new Date(tenant.lease_start_date), 'MMM dd, yyyy')} - {format(new Date(tenant.lease_end_date), 'MMM dd, yyyy')}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className="font-semibold text-lg text-gray-900">
              ${tenant.monthly_rent}
            </span>
            <span className="ml-1">/mo</span>
          </div>
          <div className="text-right">
            {isLeaseExpired ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Expired
              </span>
            ) : isLeaseExpiringSoon ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Expiring Soon
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            )}
          </div>
        </div>

        {tenant.security_deposit && (
          <div className="text-sm text-gray-600">
            Deposit: ${tenant.security_deposit}
          </div>
        )}

        {tenant.emergency_contact_name && (
          <div className="text-sm text-gray-600">
            <strong>Emergency:</strong> {tenant.emergency_contact_name}
            {tenant.emergency_contact_phone && ` (${tenant.emergency_contact_phone})`}
          </div>
        )}

        {tenant.notes && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {tenant.notes}
          </p>
        )}
      </div>
    </div>
  )
}
