import { createClient } from '@/supabase/server'
import { fetcher, setQueryString } from '@/lib/utils'
import { MessageAPI, MessagesAPI } from '@/types/api'

export async function getMessageAPI(id: string | null) {
  const query = setQueryString({ id })
  const url = query ? `/api/v1/message?${query}` : null

  if (!url) return { message: null }

  const { data: message, error } = await fetcher<MessageAPI>(url)

  return error ? { message: null } : { message }
}

export async function getMessagesAPI(
  circleId: string | null,
  params?: {
    limit?: number
    perPage?: number
    page?: number
  }
) {
  const query = setQueryString({ circleId, ...params })
  const url = query ? `/api/v1/message/list?${query}` : null

  if (!url) return { messages: null, count: null }

  const { data: messages, count, error } = await fetcher<MessagesAPI>(url)

  return error ? { messages: null, count: null } : { messages, count }
}

export async function getAdjacentMessageAPI(
  id: string | null,
  params: { circleId: string | null }
) {
  let previousMessage: MessageAPI | null = null
  let nextMessage: MessageAPI | null = null

  if (!id) return { previousMessage, nextMessage }
  if (!params?.circleId) return { previousMessage, nextMessage }

  const supabase = createClient()
  const { data: adjacent } = await supabase
    .rpc('get_adjacent_message_id', {
      messageid: id,
      circleid: params?.circleId,
    })
    .single()

  if (adjacent?.previous_id) {
    const result = await fetcher<MessageAPI>(
      `/api/v1/message?id=${adjacent?.previous_id}`
    )
    previousMessage = result?.data
  }

  if (adjacent?.next_id) {
    const result = await fetcher<MessageAPI>(
      `/api/v1/message?id=${adjacent?.next_id}`
    )
    nextMessage = result?.data
  }

  return { previousMessage, nextMessage }
}
