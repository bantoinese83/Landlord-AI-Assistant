import { DollarSign, Calendar, Building2, User, CreditCard, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface RentCardProps {
  payment: {
    id: number
    amount: number
    due_date: string
    paid_date?: string
    status: 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled'
    payment_method?: 'cash' | 'check' | 'bank_transfer' | 'online' | 'other'
    reference_number?: string
    notes?: string
    created_at: string
    property?: {
      name: string
    }
    tenant?: {
      full_name: string
    }
  }
  onEdit: (payment: any) => void
  onDelete: (id: number) => void
}

const statusConfig = {
  pending: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
  paid: { color: 'text-green-600', bg: 'bg-green-100', label: 'Paid' },
  overdue: { color: 'text-red-600', bg: 'bg-red-100', label: 'Overdue' },
  partial: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Partial' },
  cancelled: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Cancelled' },
}

const paymentMethodConfig = {
  cash: 'Cash',
  check: 'Check',
  bank_transfer: 'Bank Transfer',
  online: 'Online',
  other: 'Other',
}

export default function RentCard({ payment, onEdit, onDelete }: RentCardProps) {
  const status = statusConfig[payment.status]
  const isOverdue = payment.status === 'overdue' || (payment.status === 'pending' && new Date(payment.due_date) < new Date())

  return (
    <div className={`card-primary p-6 hover:shadow-lg transition-shadow ${
      isOverdue ? 'border-red-200 bg-red-50' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <div className={`p-2 rounded-lg ${status.bg} mr-3`}>
            <DollarSign className={`w-5 h-5 ${status.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                ${payment.amount.toLocaleString()}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                {status.label}
              </span>
            </div>
            <div className="flex items-center space-x-4 mt-1">
              {payment.property && (
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="w-4 h-4 mr-1" />
                  {payment.property.name}
                </div>
              )}
              {payment.tenant && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  {payment.tenant.full_name}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(payment)}
            className="btn btn-ghost btn-sm"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(payment.id)}
            className="btn btn-ghost btn-sm text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <div>
              <p className="font-medium">Due Date</p>
              <p>{format(new Date(payment.due_date), 'MMM dd, yyyy')}</p>
            </div>
          </div>
          {payment.paid_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <div>
                <p className="font-medium">Paid Date</p>
                <p>{format(new Date(payment.paid_date), 'MMM dd, yyyy')}</p>
              </div>
            </div>
          )}
        </div>

        {payment.payment_method && (
          <div className="flex items-center text-sm text-gray-600">
            <CreditCard className="w-4 h-4 mr-2" />
            <span>Payment Method: {paymentMethodConfig[payment.payment_method]}</span>
          </div>
        )}

        {payment.reference_number && (
          <div className="text-sm text-gray-600">
            <strong>Reference:</strong> {payment.reference_number}
          </div>
        )}

        {payment.notes && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Notes:</strong> {payment.notes}
            </p>
          </div>
        )}

        {isOverdue && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ This payment is overdue
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
