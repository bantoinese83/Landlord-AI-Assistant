'use client'

import Link from 'next/link'
import { Wrench, AlertCircle, Clock, CheckCircle } from 'lucide-react'

interface RecentMaintenanceProps {
  maintenance: any[]
  isLoading: boolean
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  in_progress: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  cancelled: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
}

export default function RecentMaintenance({ maintenance, isLoading }: RecentMaintenanceProps) {
  if (isLoading) {
    return (
      <div className="card-primary p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Maintenance</h3>
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

  const recentMaintenance = maintenance?.slice(0, 5) || []

  return (
    <div className="card-primary p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Maintenance</h3>
        <Link href="/maintenance" className="text-sm text-primary-600 hover:text-primary-500">
          View all
        </Link>
      </div>
      
      {recentMaintenance.length === 0 ? (
        <div className="text-center py-6">
          <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No maintenance requests yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentMaintenance.map((request) => {
            const status = statusConfig[request.status as keyof typeof statusConfig]
            const StatusIcon = status.icon
            
            return (
              <div key={request.id} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-full ${status.bg}`}>
                  <StatusIcon className={`w-4 h-4 ${status.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {request.title}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {request.description}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                    {request.priority && (
                      <span className="ml-2 text-xs text-gray-500">
                        {request.priority} priority
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
