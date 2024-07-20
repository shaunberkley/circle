import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidates } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'
import { pricingPlans, type PricingPlan } from '@/config/site'
import { getUserAPI } from '@/queries/server/users'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string
  const userId = searchParams.get('userId') as string

  let match: Record<string, any> = {}

  if (id) match = { ...match, id }
  if (userId) match = { ...match, owner_id: userId }

  const supabase = createClient()
  const { data: circle, error } = await supabase
    .from('circles')
    .select('*, owner:users(*), members:circle_members(*)')
    .match(match)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({ data: circle, error: null })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { data, options } = await request.json()
  const { owner_id, ...formData } = data
  const { authorized } = await authorize(owner_id)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()

  const { data: circle, error } = await supabase
    .from('circles')
    .update(formData)
    .eq('id', id)
    .select('*, owner:users(*), members:circle_members(*)')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({
    data: circle,
    error: null,
    revalidated: revalidates(options),
    now: Date.now(),
  })
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string

  const { data, options } = await request.json()
  const { members, ...formData } = data
  const { authorized } = await authorize(userId)
  const { user } = await getUserAPI(userId)

  if (!authorized || !user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const plan = pricingPlans.find((r: PricingPlan) => r.name === user?.plan)

  if (!plan) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 400 }
    )
  }

  const supabase = createClient()
  const total = await supabase
    .from('circles')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', userId)

  if (total?.error) {
    return NextResponse.json(
      { data: null, error: total?.error },
      { status: 400 }
    )
  }

  const count = total?.count ?? 0

  if (plan?.post > -1 && count >= plan?.post) {
    return NextResponse.json(
      { data: null, error: new ApiError(402) },
      { status: 402 }
    )
  }

  const { data: circle, error } = await supabase
    .from('circles')
    .insert(formData)
    .select('*, owner:users(*), members:circle_members(*)')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  if (Array.isArray(members) && members?.length > 0) {
    const findNewMembers = members?.map((r: any) => ({
      ...r,
      circle_id: circle?.id,
    }))

    if (Array.isArray(findNewMembers) && findNewMembers?.length > 0) {
      const { error } = await supabase
        .from('circle_members')
        .insert(findNewMembers)
        .select('*')
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }
  }

  return NextResponse.json({
    data: circle,
    error: null,
    revalidated: revalidates(options),
    now: Date.now(),
  })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { data, options } = await request.json()
  const { owner_id } = data
  const { authorized } = await authorize(owner_id)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const deleted = await supabase.from('circles').delete().eq('id', id)

  if (deleted?.error) {
    return NextResponse.json(
      { data: null, error: deleted?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({
    data: null,
    error: null,
    revalidated: revalidates(options),
    now: Date.now(),
  })
}
