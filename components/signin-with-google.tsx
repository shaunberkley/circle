'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'next/navigation'

import { toast } from 'sonner'
import { FcGoogle } from 'react-icons/fc'
import { Button, ButtonProps } from '@/components/ui/button'

import { createClient } from '@/supabase/client'

interface SignInWithGoogleProps
  extends ButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

const SignInWithGoogle = ({
  variant = 'outline',
  ...props
}: SignInWithGoogleProps) => {
  const { t } = useTranslation()
  const searchParams = useSearchParams()

  const onClick = async () => {
    try {
      // if "next" is in param, use it as the redirect URL
      const next = (searchParams.get('next') as string) ?? '/dashboard'

      const supabase = createClient()
      const signed = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // A URL to send the user to after they are confirmed.
          // Don't forget to change the URL in supabase's email template.
          redirectTo:
            process.env.NEXT_PUBLIC_APP_URL + `/api/auth/callback?next=${next}`,
          // Google does not send out a refresh token by default,
          // so you will need to pass parameters like these to signInWithOAuth() in order to extract the provider_refresh_token:
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (signed?.error) throw new Error(signed?.error?.message)
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    }
  }

  return (
    <Button type="button" variant={variant} onClick={onClick} {...props}>
      <FcGoogle className="mr-2 size-4 min-w-4" />
      {t('signin_with_google')}
    </Button>
  )
}

export { SignInWithGoogle, type SignInWithGoogleProps }
