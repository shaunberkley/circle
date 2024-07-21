'use client'

import useSWR from 'swr'
import { setQueryString } from '@/lib/utils'
import { CircleAPI, CirclesAPI, CountCirclesAPI } from '@/types/api'

export function useCircleAPI(id: string | null, params?: { userId?: string }) {
  const query = setQueryString({ id, ...params })
  const url = query ? `/api/v1/circle?${query}` : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    CircleAPI,
    Error
  >(url)

  return {
    circle: data?.data ?? null,
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}

export function useCirclesAPI(
  userId: string | null,
  params?: {
    q?: string
    orderBy?: string
    order?: string
    limit?: number
    perPage?: number
    page?: number
  }
) {
  const query = setQueryString({ userId, ...params })
  const url = query ? `/api/v1/circle/list?${query}` : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    CirclesAPI,
    Error
  >(url)

  return {
    circles: data?.data ?? null,
    count: data?.count ?? null,
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
