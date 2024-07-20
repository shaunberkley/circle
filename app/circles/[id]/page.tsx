import { notFound } from 'next/navigation'
import { staticSupabaseClient } from '@/lib/utils/staticSupabaseClient'
import { createClient } from '@/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

interface CirclePageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  console.log('Fetching static supabase client')
  const { data: circles, error } = await staticSupabaseClient
    .from('circles')
    .select('id')

  if (error) {
    console.error('Error fetching circles in generateStaticParams:', error)
    return []
  }

  if (!circles) {
    console.error('No circles found in generateStaticParams')
    return []
  }

  return circles.map((circle: { id: string }) => ({
    id: circle.id,
  }))
}

export default async function CirclePage({ params }: CirclePageProps) {
  const { id } = params

  console.log('Fetching circle with id:', id)

  const supabase = createClient()
  const { data: circle, error } = await supabase
    .from('circles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !circle) {
    console.error('Error or no circle found:', error)
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-[80vh] pb-20 sm:pb-40">
        <div className="container flex-1 overflow-auto">
          <h1>{circle.name}</h1>
          <p>{circle.description}</p>
          {/* Add more circle details here */}
        </div>
      </main>
      <Footer />
    </>
  )
}
