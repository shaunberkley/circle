import { fetcher, setQueryString } from '@/lib/utils'
import { CircleAPI, CirclesAPI } from '@/types/api'

export async function getCircleAPI(id: string | null) {
  const query = setQueryString({ id })
  console.log(query)
  const url = query ? `/api/v1/circle?${query}` : null

  if (!url) return { circle: null }

  const { data: circle, error } = await fetcher<CircleAPI>(url)

  return error ? { circle: null } : { circle }
}

export async function getCirclesAPI(
  userId: string | null,
  params?: {
    isPublic?: boolean
    limit?: number
    perPage?: number
    page?: number
  }
) {
  const query = setQueryString({ userId, ...params })
  const url = query ? `/api/v1/circle/list?${query}` : null
  console.log(query)
  if (!url) return { circles: null, count: null }

  const { data: circles, count, error } = await fetcher<CirclesAPI>(url)

  return error ? { circles: null, count: null } : { circles, count }
}
