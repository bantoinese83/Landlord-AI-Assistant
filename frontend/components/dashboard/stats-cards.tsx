'use client'

import { Building2, Users, Wrench, DollarSign } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalProperties: number
    totalTenants: number
    pendingMaintenance: number
    monthlyRent: number
  }
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      name: 'Total Properties',
      value: stats.totalProperties,
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Tenants',
      value: stats.totalTenants,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Pending Maintenance',
      value: stats.pendingMaintenance,
      icon: Wrench,
      color: 'bg-yellow-500',
    },
    {
      name: 'Monthly Rent',
      value: `$${stats.monthlyRent.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.name} className="card-primary p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${card.color}`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{card.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
