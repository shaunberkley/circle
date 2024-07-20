import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { AddDummyCircle } from './components/add-dummy-circle'
import { AddCircle } from './components/add-circle'
import { CircleList } from './circle-list'

export default function CirclesPage() {
  return (
    <main className="flex-1 space-y-4 overflow-auto p-8 pb-36">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Title translate="yes">circle_list</Title>
          <Description translate="yes">create_and_manage_circles</Description>
        </div>
        <div className="flex space-x-2 align-bottom">
          <AddDummyCircle
            variant="default"
            startIconName="CopyPlus"
            translate="yes"
          >
            dummy_circle
          </AddDummyCircle>
          <AddCircle variant="outline" startIconName="Plus" translate="yes">
            new_circle
          </AddCircle>
        </div>
      </div>
      <Separator />
      <CircleList />
    </main>
  )
}
