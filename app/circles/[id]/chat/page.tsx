import { notFound } from 'next/navigation'
import { staticSupabaseClient } from '@/lib/utils/staticSupabaseClient'

import Chat from './components/chat'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { authenticate, getAuth } from '@/queries/server/auth'

interface ChatPageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  const { data: circles, error } = await staticSupabaseClient
    .from('circles')
    .select('id')

  if (error) {
    console.error(error)
    return []
  }

  return circles.map((circle: { id: string }) => ({
    id: circle.id,
  }))
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = params

  const supabase = staticSupabaseClient
  const { data: circle, error } = await supabase
    .from('circles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !circle) {
    notFound()
  }

  const { authenticated } = await authenticate()
  const { session } = await getAuth()

  if (!authenticated || !session) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="flex h-[calc(100dvh-134px)] w-full">
        <Chat circleId={id} session={session} />
      </main>
      <Footer />
    </>
  )
}
