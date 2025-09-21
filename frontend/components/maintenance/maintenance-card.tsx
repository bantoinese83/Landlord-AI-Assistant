import { Wrench, AlertCircle, Clock, CheckCircle, X, Building2, User, DollarSign, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface MaintenanceCardProps {
  request: {
    id: number
    title: string
    description: string
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    estimated_cost?: string
    actual_cost?: string
    completion_notes?: string
    created_at: string
    updated_at?: string
    property?: {
      name: string
    }
    tenant?: {
      full_name: string
    }
  }
  onEdit: (request: any) => void
  onDelete: (id: number) => void
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
  in_progress: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'In Progress' },
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' },
  cancelled: { icon: X, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
}

const priorityConfig = {
  low: { color: 'text-gray-600', bg: 'bg-gray-100' },
  medium: { color: 'text-yellow-600', bg: 'bg-yellow-100' },
  high: { color: 'text-orange-600', bg: 'bg-orange-100' },
  urgent: { color: 'text-red-600', bg: 'bg-red-100' },
}

export default function MaintenanceCard({ request, onEdit, onDelete }: MaintenanceCardProps) {
  const status = statusConfig[request.status]
  const priority = priorityConfig[request.priority]
  const StatusIcon = status.icon

  return (
    <div className="card-primary p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <div className={`p-2 rounded-lg ${status.bg} mr-3`}>
            <StatusIcon className={`w-5 h-5 ${status.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
            <div className="flex items-center space-x-4 mt-1">
              {request.property && (
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="w-4 h-4 mr-1" />
                  {request.property.name}
                </div>
              )}
              {request.tenant && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  {request.tenant.full_name}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(request)}
            className="btn btn-ghost btn-sm"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(request.id)}
            className="btn btn-ghost btn-sm text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-gray-700">{request.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
              {status.label}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
              {request.priority} priority
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {format(new Date(request.created_at), 'MMM dd, yyyy')}
          </div>
        </div>

        {(request.estimated_cost || request.actual_cost) && (
          <div className="flex items-center space-x-4 text-sm">
            {request.estimated_cost && (
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>Est: ${request.estimated_cost}</span>
              </div>
            )}
            {request.actual_cost && (
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>Actual: ${request.actual_cost}</span>
              </div>
            )}
          </div>
        )}

        {request.completion_notes && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Completion Notes:</strong> {request.completion_notes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
