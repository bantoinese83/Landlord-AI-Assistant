'use client'

import Link from 'next/link'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

interface RentOverviewProps {
  rent: any[]
  isLoading: boolean
}

export default function RentOverview({ rent, isLoading }: RentOverviewProps) {
  if (isLoading) {
    return (
      <div className="card-primary p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Rent Overview</h3>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const paidRent = rent?.filter((payment: any) => payment.status === 'paid') || []
  const pendingRent = rent?.filter((payment: any) => payment.status === 'pending') || []
  const overdueRent = rent?.filter((payment: any) => payment.status === 'overdue') || []

  const totalPaid = paidRent.reduce((sum: number, payment: any) => sum + payment.amount, 0)
  const totalPending = pendingRent.reduce((sum: number, payment: any) => sum + payment.amount, 0)
  const totalOverdue = overdueRent.reduce((sum: number, payment: any) => sum + payment.amount, 0)

  return (
    <div className="card-primary p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Rent Overview</h3>
        <Link href="/rent" className="text-sm text-primary-600 hover:text-primary-500">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Paid</p>
              <p className="text-2xl font-bold text-green-900">
                ${totalPaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">
                ${totalPending.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">Overdue</p>
              <p className="text-2xl font-bold text-red-900">
                ${totalOverdue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Payments</h4>
        <div className="space-y-2">
          {rent?.slice(0, 5).map((payment: any) => (
            <div key={payment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {payment.property?.name || 'Unknown Property'}
                </p>
                <p className="text-xs text-gray-500">
                  {payment.tenant?.full_name || 'Unknown Tenant'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ${payment.amount.toLocaleString()}
                </p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  payment.status === 'paid' 
                    ? 'bg-green-100 text-green-800'
                    : payment.status === 'overdue'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
