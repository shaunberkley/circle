import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { authorize } from '@/queries/server/auth'
import { ApiError, revalidates } from '@/lib/utils'

// Fetch messages for a circle
export async function GET(
  request: NextRequest,
  { params }: { params: { circleId: string } }
) {
  const supabase = createClient()
  const circleId = params.circleId

  // Fetch the latest 25 messages for the circle
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*, user:user_id(*)')
    .eq('circle_id', circleId)
    .order('timestamp', { ascending: true })
    .limit(100)

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({ data: messages, error: null })
}

// Send a new message to a circle
export async function POST(
  request: NextRequest,
  { params }: { params: { circleId: string } }
) {
  const supabase = createClient()
  const circleId = params.circleId

  const { authorized, user, error: authError } = await authorize(request)

  if (authError) {
    return NextResponse.json(
      { data: null, error: new ApiError(401, authError) },
      { status: 401 }
    )
  }

  const { user_id, content } = await request.json()

  const newMessage = {
    user_id,
    content,
    timestamp: new Date().toISOString(),
    circle_id: circleId,
  }

  const { data: message, error } = await supabase
    .from('messages')
    .insert(newMessage)
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({
    data: message,
    error: null,
    revalidated: revalidates(),
    now: Date.now(),
  })
}
