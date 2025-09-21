'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { Wrench, RefreshCw, Building2, AlertTriangle } from 'lucide-react'

interface MaintenanceRecommendationsProps {
  properties: any[]
}

export default function MaintenanceRecommendations({ properties }: MaintenanceRecommendationsProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const { data: recommendations, isLoading, refetch } = useQuery(
    ['maintenance-recommendations', selectedPropertyId],
    () => api.get(`/ai/maintenance-recommendations/${selectedPropertyId}`).then(res => res.data),
    {
      enabled: false,
    }
  )

  const handleGenerate = async () => {
    if (!selectedPropertyId) {
      toast.error('Please select a property first')
      return
    }

    setIsGenerating(true)
    try {
      await refetch()
      toast.success('Maintenance recommendations generated!')
    } catch (error) {
      toast.error('Failed to generate recommendations')
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading || isGenerating) {
    return (
      <div className="card-primary p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Generating maintenance recommendations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card-primary p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Maintenance Recommendations</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Property
            </label>
            <select
              value={selectedPropertyId || ''}
              onChange={(e) => setSelectedPropertyId(Number(e.target.value) || null)}
              className="select-primary"
            >
              <option value="">Choose a property</option>
              {properties?.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name} - {property.address}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedPropertyId || isGenerating}
            className="btn btn-primary"
          >
            <Wrench className="w-4 h-4 mr-2" />
            Generate Recommendations
          </button>
        </div>
      </div>

      {recommendations && (
        <div className="card-primary p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
          
          {recommendations.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800">
                  {recommendations.error === 'AI service not configured' 
                    ? 'AI service is not configured. Please set up OpenAI API key.'
                    : recommendations.error
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {recommendations.recommendations || 'No recommendations available'}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {!recommendations && selectedPropertyId && (
        <div className="card-primary p-6">
          <div className="text-center py-8">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
            <p className="text-gray-500">
              Click the button above to generate AI-powered maintenance recommendations for the selected property.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
