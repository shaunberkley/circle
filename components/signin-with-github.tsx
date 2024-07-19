'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'next/navigation'

import { toast } from 'sonner'
import { FaGithub } from 'react-icons/fa'
import { Button, ButtonProps } from '@/components/ui/button'

import { createClient } from '@/supabase/client'

interface SignInWithGithubProps
  extends ButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

const SignInWithGithub = ({
  variant = 'outline',
  ...props
}: SignInWithGithubProps) => {
  const { t } = useTranslation()
  const searchParams = useSearchParams()

  const onClick = async () => {
    try {
      // if "next" is in param, use it as the redirect URL
      const next = (searchParams.get('next') as string) ?? '/dashboard'

      const supabase = createClient()
      const signed = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          // A URL to send the user to after they are confirmed.
          // Don't forget to change the URL in supabase's email template.
          redirectTo:
            process.env.NEXT_PUBLIC_APP_URL + `/api/auth/callback?next=${next}`,
        },
      })

      if (signed?.error) throw new Error(signed?.error?.message)
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    }
  }

  return (
    <Button type="button" variant={variant} onClick={onClick} {...props}>
      <FaGithub className="mr-2 h-4 w-4" />
      {t('signin_with_github')}
    </Button>
  )
}

export { SignInWithGithub, type SignInWithGithubProps }
