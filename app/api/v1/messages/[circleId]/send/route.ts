import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@/supabase/server'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { circleId } = req.query
  const { user, content } = req.body

  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .insert([{ circle_id: circleId, user, content, timestamp: new Date() }])
    .single()

  if (error) {
    return res.status(400).json({ error })
  }

  res.status(200).json(data)
}
