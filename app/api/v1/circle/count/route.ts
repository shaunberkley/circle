import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidates } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'
import { Database } from '@/types/supabase'

type CountCirclesResult =
  Database['public']['Functions']['count_circles']['Returns'][number]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string
  const q = (searchParams.get('q') as string) ?? null

  const { authorized } = await authorize(userId)

  if (!authorized) {
    return NextResponse.json(
      { data: null, count: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase.rpc('count_circles', {
    userid: userId,
    q,
  })

  if (result?.error) {
    return NextResponse.json(
      { data: null, count: null, error: result?.error },
      { status: 400 }
    )
  }

  const defaultValues: CountCirclesResult[] = [
    { status: 'active', count: 0 },
    { status: 'inactive', count: 0 },
  ]

  const data = defaultValues?.map((row) => {
    return (
      result?.data?.find((r: CountCirclesResult) => r.status === row.status) ??
      row
    )
  })

  const count = data?.reduce((acc, curr) => {
    return acc + curr.count
  }, 0)

  return NextResponse.json({ data, count, error: null })
}
