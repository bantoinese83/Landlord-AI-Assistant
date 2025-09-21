'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { Lightbulb, RefreshCw, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react'

export default function AIInsights() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: insights, isLoading, refetch } = useQuery(
    'ai-insights',
    () => api.get('/ai/insights').then(res => res.data),
    {
      enabled: false, // Don't auto-fetch, require manual trigger
    }
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetch()
      toast.success('Insights refreshed successfully!')
    } catch (error) {
      toast.error('Failed to refresh insights')
    } finally {
      setIsRefreshing(false)
    }
  }

  if (isLoading || isRefreshing) {
    return (
      <div className="card-primary p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Generating AI insights...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!insights) {
    return (
      <div className="card-primary p-6">
        <div className="text-center py-12">
          <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Get AI Insights</h3>
          <p className="text-gray-500 mb-6">
            Generate AI-powered insights about your properties to optimize your management strategy.
          </p>
          <button
            onClick={handleRefresh}
            className="btn btn-primary"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Generate Insights
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card-primary p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Property Insights</h2>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {insights.error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">
                {insights.error === 'AI service not configured' 
                  ? 'AI service is not configured. Please set up OpenAI API key.'
                  : insights.error
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {insights.insights || insights.analysis || 'No insights available'}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-primary p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Market Analysis</p>
              <p className="text-lg font-semibold text-gray-900">Available</p>
            </div>
          </div>
        </div>

        <div className="card-primary p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Rent Optimization</p>
              <p className="text-lg font-semibold text-gray-900">Available</p>
            </div>
          </div>
        </div>

        <div className="card-primary p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Recommendations</p>
              <p className="text-lg font-semibold text-gray-900">Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
