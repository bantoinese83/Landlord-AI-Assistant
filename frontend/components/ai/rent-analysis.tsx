'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { DollarSign, RefreshCw, Building2, AlertTriangle, TrendingUp } from 'lucide-react'

interface RentAnalysisProps {
  properties: any[]
}

export default function RentAnalysis({ properties }: RentAnalysisProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const { data: analysis, isLoading, refetch } = useQuery(
    ['rent-analysis', selectedPropertyId],
    () => api.get(`/ai/rent-analysis/${selectedPropertyId}`).then(res => res.data),
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
      toast.success('Rent analysis generated!')
    } catch (error) {
      toast.error('Failed to generate rent analysis')
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedProperty = properties?.find(p => p.id === selectedPropertyId)

  if (isLoading || isGenerating) {
    return (
      <div className="card-primary p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Generating rent analysis...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card-primary p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Rent Market Analysis</h2>
        
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
                  {property.name} - ${property.rent_amount}/mo
                </option>
              ))}
            </select>
          </div>

          {selectedProperty && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Current Property Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Current Rent:</span>
                  <span className="ml-2 font-medium">${selectedProperty.rent_amount}</span>
                </div>
                <div>
                  <span className="text-gray-500">Property Type:</span>
                  <span className="ml-2 font-medium">{selectedProperty.property_type}</span>
                </div>
                <div>
                  <span className="text-gray-500">Bedrooms:</span>
                  <span className="ml-2 font-medium">{selectedProperty.bedrooms || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Bathrooms:</span>
                  <span className="ml-2 font-medium">{selectedProperty.bathrooms || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!selectedPropertyId || isGenerating}
            className="btn btn-primary"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Generate Analysis
          </button>
        </div>
      </div>

      {analysis && (
        <div className="card-primary p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Analysis</h3>
          
          {analysis.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800">
                  {analysis.error === 'AI service not configured' 
                    ? 'AI service is not configured. Please set up OpenAI API key.'
                    : analysis.error
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {analysis.analysis || 'No analysis available'}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {!analysis && selectedPropertyId && (
        <div className="card-primary p-6">
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</h3>
            <p className="text-gray-500">
              Click the button above to generate AI-powered rent market analysis for the selected property.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
