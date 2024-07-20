import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { data: null, error: 'ID is required' },
      { status: 400 }
    )
  }

  const supabase = createClient()
  const { data: circle, error } = await supabase
    .from('circles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: circle, error: null })
}
