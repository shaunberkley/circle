'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { LucideIcon, type LucideIconName } from '@/lib/lucide-icon'
import { toast } from 'sonner'
import { Button, ButtonProps } from '@/components/ui/button'

import { cn, fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { CircleAPI } from '@/types/api'

interface AddCircleProps
  extends ButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  startIconName?: LucideIconName
  startIconClassName?: string
  endIconName?: LucideIconName
  endIconClassName?: string
  text?: string
  ns?: string
}

const AddCircle = ({
  children,
  startIconName,
  startIconClassName,
  endIconName,
  endIconClassName,
  text,
  ns,
  translate,
  ...props
}: AddCircleProps) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useAuth()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onClick = async () => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('User is not defined.')

      const { data: circle, error } = await fetcher<CircleAPI>(
        `/api/v1/circle?userId=${user?.id}`,
        {
          method: 'POST',
          body: JSON.stringify({
            data: { name: 'Untitled Circle', owner_id: user?.id },
          }),
        }
      )

      if (error) throw new Error(error?.message)

      router.push(`/dashboard/circles/edit?id=${circle?.id}`)
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

export { AddCircle, type AddCircleProps }
