'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import Navbar from '@/components/layout/navbar'
import AIInsights from '@/components/ai/ai-insights'
import MaintenanceRecommendations from '@/components/ai/maintenance-recommendations'
import RentAnalysis from '@/components/ai/rent-analysis'
import TenantCommunication from '@/components/ai/tenant-communication'
import { Bot, Lightbulb, Wrench, DollarSign, MessageSquare } from 'lucide-react'

const aiFeatures = [
  {
    id: 'insights',
    name: 'Property Insights',
    description: 'Get AI-powered insights about your properties',
    icon: Lightbulb,
    color: 'bg-blue-500',
  },
  {
    id: 'maintenance',
    name: 'Maintenance Recommendations',
    description: 'AI suggestions for property maintenance',
    icon: Wrench,
    color: 'bg-green-500',
  },
  {
    id: 'rent',
    name: 'Rent Analysis',
    description: 'Market analysis and rent optimization',
    icon: DollarSign,
    color: 'bg-purple-500',
  },
  {
    id: 'communication',
    name: 'Tenant Communication',
    description: 'Generate professional tenant communications',
    icon: MessageSquare,
    color: 'bg-orange-500',
  },
]

export default function AIAssistantPage() {
  const [activeFeature, setActiveFeature] = useState('insights')

  const { data: properties } = useQuery(
    'properties',
    () => api.get('/properties').then(res => res.data)
  )

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'insights':
        return <AIInsights />
      case 'maintenance':
        return <MaintenanceRecommendations properties={properties} />
      case 'rent':
        return <RentAnalysis properties={properties} />
      case 'communication':
        return <TenantCommunication />
      default:
        return <AIInsights />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Bot className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
                <p className="mt-2 text-gray-600">
                  Leverage AI to optimize your property management
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Feature Navigation */}
            <div className="lg:col-span-1">
              <div className="card-primary p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">AI Features</h3>
                <nav className="space-y-2">
                  {aiFeatures.map((feature) => {
                    const Icon = feature.icon
                    return (
                      <button
                        key={feature.id}
                        onClick={() => setActiveFeature(feature.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          activeFeature === feature.id
                            ? 'bg-primary-50 text-primary-700 border border-primary-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg ${feature.color} mr-3`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{feature.name}</p>
                            <p className="text-sm text-gray-500">{feature.description}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Feature Content */}
            <div className="lg:col-span-3">
              {renderActiveFeature()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
