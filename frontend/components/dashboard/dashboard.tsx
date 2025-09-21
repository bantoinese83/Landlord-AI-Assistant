'use client'

import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import Navbar from '@/components/layout/navbar'
import StatsCards from '@/components/dashboard/stats-cards'
import RecentProperties from '@/components/dashboard/recent-properties'
import RecentMaintenance from '@/components/dashboard/recent-maintenance'
import RentOverview from '@/components/dashboard/rent-overview'

export default function Dashboard() {
  const { data: properties, isLoading: propertiesLoading } = useQuery(
    'properties',
    () => api.get('/properties').then(res => res.data)
  )

  const { data: maintenance, isLoading: maintenanceLoading } = useQuery(
    'maintenance',
    () => api.get('/maintenance').then(res => res.data)
  )

  const { data: rent, isLoading: rentLoading } = useQuery(
    'rent',
    () => api.get('/rent').then(res => res.data)
  )

  const stats = {
    totalProperties: properties?.length || 0,
    totalTenants: properties?.reduce((acc: number, prop: any) => acc + (prop.tenants?.length || 0), 0) || 0,
    pendingMaintenance: maintenance?.filter((req: any) => req.status === 'pending').length || 0,
    monthlyRent: properties?.reduce((acc: number, prop: any) => acc + prop.rent_amount, 0) || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back! Here's an overview of your properties.
            </p>
          </div>

          <StatsCards stats={stats} />

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecentProperties 
              properties={properties} 
              isLoading={propertiesLoading} 
            />
            <RecentMaintenance 
              maintenance={maintenance} 
              isLoading={maintenanceLoading} 
            />
          </div>

          <div className="mt-8">
            <RentOverview 
              rent={rent} 
              isLoading={rentLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
