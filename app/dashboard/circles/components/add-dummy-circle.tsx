'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'next/navigation'

import { toast } from 'sonner'
import { Button, ButtonProps } from '@/components/ui/button'
import { LucideIcon, type LucideIconName } from '@/lib/lucide-icon'

import { useSWRConfig } from 'swr'
import {
  fetcher,
  setQueryString,
  generateRecentCircles,
  cn,
  relativeUrl,
} from '@/lib/utils'
import { useUserAPI } from '@/queries/client/users'
import { CircleAPI } from '@/types/api'

interface AddDummyCircleProps
  extends ButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  startIconName?: LucideIconName
  startIconClassName?: string
  endIconName?: LucideIconName
  endIconClassName?: string
  text?: string
  ns?: string
}

const AddDummyCircle = ({
  children,
  startIconName,
  startIconClassName,
  endIconName,
  endIconClassName,
  text,
  ns,
  translate,
  ...props
}: AddDummyCircleProps) => {
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const { user } = useUserAPI()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onClick = async () => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('User is not defined.')

      const circles = generateRecentCircles(user, 1)

      for (let i = 0; i < circles.length; i++) {
        const circle = circles[i]
        const revalidatePaths = circle?.permalink
          ? relativeUrl(circle?.permalink)
          : null

        const { error } = await fetcher<CircleAPI>(
          `/api/v1/circle?userId=${user?.id}`,
          {
            method: 'POST',
            body: JSON.stringify({
              data: circle,
              options: { revalidatePaths },
            }),
          }
        )

        if (error) throw new Error(error?.message)

        const countSearchParams = setQueryString({
          userId: user?.id,
          q: searchParams.get('q') as string,
        })

        const listSearchParams = setQueryString({
          userId: user?.id,
          page: +((searchParams.get('page') as string) ?? '1'),
          perPage: +((searchParams.get('perPage') as string) ?? '10'),
          q: searchParams.get('q') as string,
          orderBy: (searchParams.get('orderBy') as string) ?? 'id',
          order: (searchParams.get('order') as string) ?? 'desc',
        })

        mutate(`/api/v1/circle?userId=${user?.id}`)
        mutate(`/api/v1/circle/count?${countSearchParams}`)
        mutate(`/api/v1/circle/list?${listSearchParams}`)
      }
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('Payment Required')) {
        toast.error(t('402.statusText', { ns: 'httpstatuscode' }))
      } else {
        toast.error((e as Error)?.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button type="button" onClick={onClick} disabled={isSubmitting} {...props}>
      {startIconName ? (
        <LucideIcon
          name={startIconName}
          className={cn('mr-2 size-4 min-w-4', startIconClassName)}
        />
      ) : null}
      {text && translate === 'yes' ? t(text, { ns }) : text}
      {children && typeof children === 'string' && translate === 'yes'
        ? t(children, { ns })
        : children}
      {endIconName ? (
        <LucideIcon
          name={endIconName}
          className={cn('ml-2 size-4 min-w-4', endIconClassName)}
        />
      ) : null}
    </Button>
  )
}

export { AddDummyCircle, type AddDummyCircleProps }
