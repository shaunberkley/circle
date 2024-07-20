import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string
  const q = searchParams.get('q') as string
  const orderBy = (searchParams.get('orderBy') as string) ?? 'id'
  const order = (searchParams.get('order') as string) ?? 'asc'
  const limit = +((searchParams.get('limit') as string) ?? '10')
  const page = +((searchParams.get('page') as string) ?? '1')
  const offset = (page - 1) * limit

  const { authorized } = await authorize(userId)

  if (!authorized) {
    return NextResponse.json(
      { data: null, count: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const totalQuery = supabase
    .from('circles')
    .select('*', { count: 'exact', head: true })

  if (q) totalQuery.ilike('name', `%${q}%`)

  const total = await totalQuery

  if (total?.error) {
    return NextResponse.json(
      { data: null, count: null, error: total?.error },
      { status: 400 }
    )
  }

  const listQuery = supabase
    .from('circles')
    .select('*, owner:users(*), members:circle_members(*, user:users(*))')
    .order(orderBy, { ascending: order === 'asc' })
    .range(offset, offset + limit - 1)

  if (q) listQuery.ilike('name', `%${q}%`)

  const { data: list, error } = await listQuery

  if (error) {
    return NextResponse.json(
      { data: null, count: null, error },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: list, count: total.count, error: null })
}
