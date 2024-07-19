'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { Button, ButtonProps } from '@/components/ui/button'

import { createClient } from '@/supabase/client'
import { useAuth } from '@/hooks/use-auth'

interface SignOutButtonProps
  extends ButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

const SignOutButton = (props: SignOutButtonProps) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { setSession, setUser } = useAuth()

  const onClick = async () => {
    try {
      const supabase = createClient()
      const unsigned = await supabase.auth.signOut()

      if (unsigned?.error) throw new Error(unsigned?.error?.message)

      setSession(null)
      setUser(null)

      router.refresh()
      router.replace('/')
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    }
  }

  return (
    <Button type="button" onClick={onClick} {...props}>
      {t('signout')}
    </Button>
  )
}

export { SignOutButton, type SignOutButtonProps }
