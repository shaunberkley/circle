'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import useSWR from 'swr'

const Notify = () => {
  const { t } = useTranslation()
  const { data } = useSWR<{ data: any[]; count: number }>(
    process.env.NEXT_PUBLIC_APP_URL + '/api/v1/notify'
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="-mr-2">
          <LucideIcon name="Bell" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Card className="w-[360px] border-0">
          <CardHeader>
            <CardTitle>{t('notifications')}</CardTitle>
            <CardDescription>
              {t('you_have_%d_unread_messages', { count: data?.count })}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Separator className="mb-2" />
            {data?.data?.map((item) => (
              <NotifyItem key={item.id} item={item} />
            ))}
          </CardContent>
          <CardFooter>
            <Button type="button" className="w-full">
              <LucideIcon name="Check" className="mr-2 size-4 min-w-4" />
              {t('mark_all_as_read')}
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

interface NotifyItemProps {
  id: number
  title: string
  description: string
}

const NotifyItem = ({ item }: { item: NotifyItemProps }) => {
  return (
    <div className="grid grid-cols-[16px_1fr] items-start">
      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-black"></span>
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{item.title}</p>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
    </div>
  )
}

export { Notify }
