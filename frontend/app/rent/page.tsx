'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'
import Navbar from '@/components/layout/navbar'
import RentCard from '@/components/rent/rent-card'
import RentModal from '@/components/rent/rent-modal'
import { Plus, Search, Filter, DollarSign } from 'lucide-react'

export default function RentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const queryClient = useQueryClient()

  const { data: rent, isLoading } = useQuery(
    'rent',
    () => api.get('/rent').then(res => res.data)
  )

  const deleteMutation = useMutation(
    (id: number) => api.delete(`/rent/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rent')
        toast.success('Rent payment deleted successfully')
      },
      onError: () => {
        toast.error('Failed to delete rent payment')
      },
    }
  )

  const filteredRent = rent?.filter((payment: any) => {
    const matchesSearch = payment.property?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.tenant?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference_number?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

  const handleEdit = (payment: any) => {
    setEditingPayment(payment)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this rent payment?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPayment(null)
  }

  const statusCounts = {
    all: rent?.length || 0,
    pending: rent?.filter((payment: any) => payment.status === 'pending').length || 0,
    paid: rent?.filter((payment: any) => payment.status === 'paid').length || 0,
    overdue: rent?.filter((payment: any) => payment.status === 'overdue').length || 0,
    partial: rent?.filter((payment: any) => payment.status === 'partial').length || 0,
    cancelled: rent?.filter((payment: any) => payment.status === 'cancelled').length || 0,
  }

  const totalAmount = rent?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0
  const paidAmount = rent?.filter((payment: any) => payment.status === 'paid').reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0
  const pendingAmount = rent?.filter((payment: any) => payment.status === 'pending').reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0
  const overdueAmount = rent?.filter((payment: any) => payment.status === 'overdue').reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rent Management</h1>
              <p className="mt-2 text-gray-600">
                Track rent payments and financial overview
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="card-primary p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-500">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-2xl font-semibold text-gray-900">${totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="card-primary p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-500">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Paid</p>
                  <p className="text-2xl font-semibold text-gray-900">${paidAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="card-primary p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-500">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">${pendingAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="card-primary p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-red-500">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Overdue</p>
                  <p className="text-2xl font-semibold text-gray-900">${overdueAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search rent payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-primary pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select-primary"
                >
                  <option value="all">All Status ({statusCounts.all})</option>
                  <option value="pending">Pending ({statusCounts.pending})</option>
                  <option value="paid">Paid ({statusCounts.paid})</option>
                  <option value="overdue">Overdue ({statusCounts.overdue})</option>
                  <option value="partial">Partial ({statusCounts.partial})</option>
                  <option value="cancelled">Cancelled ({statusCounts.cancelled})</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card-primary p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredRent.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <DollarSign className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rent payments found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filter.' : 'Get started by recording your first rent payment.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Record Payment
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRent.map((payment: any) => (
                <RentCard
                  key={payment.id}
                  payment={payment}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <RentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        payment={editingPayment}
      />
    </div>
  )
}
