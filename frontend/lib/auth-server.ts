import { cookies } from 'next/headers'
import { api } from '@/lib/api'

export async function getServerSession() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
      return null
    }

    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    return null
  }
}
