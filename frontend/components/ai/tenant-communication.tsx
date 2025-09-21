'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { MessageSquare, Send, RefreshCw, AlertTriangle } from 'lucide-react'

export default function TenantCommunication() {
  const [tenantId, setTenantId] = useState('')
  const [context, setContext] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const { data: tenants } = useQuery(
    'tenants',
    () => api.get('/tenants').then(res => res.data)
  )

  const generateMutation = useMutation(
    (data: { tenant_id: number; context: string }) => 
      api.post('/ai/generate-communication', data).then(res => res.data),
    {
      onSuccess: (data) => {
        toast.success('Communication generated successfully!')
      },
      onError: () => {
        toast.error('Failed to generate communication')
      },
    }
  )

  const handleGenerate = async () => {
    if (!tenantId || !context.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setIsGenerating(true)
    try {
      await generateMutation.mutateAsync({
        tenant_id: Number(tenantId),
        context: context.trim()
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card-primary p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Tenant Communication</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tenant
            </label>
            <select
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="select-primary"
            >
              <option value="">Choose a tenant</option>
              {tenants?.map((tenant: any) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.full_name} - {tenant.property?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Communication Context
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={4}
              className="textarea-primary"
              placeholder="Describe what you want to communicate to the tenant (e.g., rent increase notice, maintenance schedule, lease renewal, etc.)"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!tenantId || !context.trim() || isGenerating}
            className="btn btn-primary"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Communication'}
          </button>
        </div>
      </div>

      {generateMutation.data && (
        <div className="card-primary p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Communication</h3>
          
          {generateMutation.data.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800">
                  {generateMutation.data.error === 'AI service not configured' 
                    ? 'AI service is not configured. Please set up OpenAI API key.'
                    : generateMutation.data.error
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {generateMutation.data.message || 'No communication generated'}
                </pre>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => navigator.clipboard.writeText(generateMutation.data.message)}
                  className="btn btn-secondary btn-sm"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => {
                    setTenantId('')
                    setContext('')
                    generateMutation.reset()
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  Generate New
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!generateMutation.data && tenantId && context && (
        <div className="card-primary p-6">
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
            <p className="text-gray-500">
              Click the button above to generate a professional communication for the selected tenant.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
