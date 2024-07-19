import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidates } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'
import { Database } from '@/types/supabase'

type CountPostsResult =
  Database['public']['Functions']['count_posts']['Returns'][number]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string
  const postType = (searchParams.get('postType') as string) ?? 'post'
  const q = (searchParams.get('q') as string) ?? null

  const { authorized } = await authorize(userId)

  if (!authorized) {
    return NextResponse.json(
      { data: null, count: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase.rpc('count_posts', {
    userid: userId,
    posttype: postType,
    q,
  })

  if (result?.error) {
    return NextResponse.json(
      { data: null, count: null, error: result?.error },
      { status: 400 }
    )
  }

  const defaultValues: CountPostsResult[] = [
    { status: 'publish', count: 0 },
    { status: 'future', count: 0 },
    { status: 'draft', count: 0 },
    { status: 'pending', count: 0 },
    { status: 'private', count: 0 },
    { status: 'trash', count: 0 },
  ]

  const data = defaultValues?.map((row) => {
    return (
      result?.data?.find((r: CountPostsResult) => r.status === row.status) ??
      row
    )
  })

  const count = data?.reduce((acc, curr) => {
    if (curr.status === 'trash') return acc
    return acc + curr.count
  }, 0)

  return NextResponse.json({ data, count, error: null })
}
