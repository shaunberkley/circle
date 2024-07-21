import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { circleId: string } }
) {
  const url = new URL(request.url)
  const userId = url.searchParams.get('userId')

  const supabase = createClient()

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing userId query parameter' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('user_read_status')
    .select('*')
    .eq('circle_id', params.circleId)
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching read status:', error)
    return NextResponse.json(
      { error: 'Error fetching read status' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data }, { status: 200 })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { circleId: string } }
) {
  const supabase = createClient()
  const { lastReadMessageId, userId } = await request.json()

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing userId in request body' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase.from('user_read_status').upsert(
    {
      user_id: userId,
      circle_id: params.circleId,
      last_read_message_id: lastReadMessageId,
      last_read_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,circle_id' }
  )

  if (error) {
    console.error('Error updating read status:', error)
    return NextResponse.json(
      { error: 'Error updating read status' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data }, { status: 200 })
}
