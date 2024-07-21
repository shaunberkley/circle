import * as React from 'react'

import { Title } from '@/components/title'
import { AddCircle } from '../components/add-circle'

import { BackLink } from './components/back-link'
import { PostForm } from './post-form'

export default function PostEditPage({
  searchParams: { id },
}: {
  searchParams: { id: string }
}) {
  return (
    <main className="flex-1 space-y-4 overflow-auto p-8 pb-36">
      <div className="flex items-center space-x-2">
        <BackLink />
        <Title translate="yes">edit_post</Title>
        <AddCircle variant="secondary" translate="yes">
          add_post
        </AddCircle>
      </div>
      <PostForm id={+id} />
    </main>
  )
}
