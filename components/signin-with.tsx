import * as React from 'react'

import { SignInWithGoogle } from '@/components/signin-with-google'
// import { SignInWithGithub } from '@/components/auth/signin-with-github'

const SignInWith = () => {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <div className="grid gap-2">
        {/* <SignInWithGithub /> */}
        <SignInWithGoogle />
      </div>
    </>
  )
}

export { SignInWith }
