import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/components/ui/card'

const UpgradeProBanner = () => {
  return (
    <div className="mt-auto p-4">
      <Button
        type="button"
        variant="outline"
        className="inline-flex w-full lg:hidden"
      >
        Pro
      </Button>
      <Card className="hidden max-w-60 lg:block">
        <CardHeader className="pb-4">
          <CardTitle>Upgrade to Pro</CardTitle>
          <CardDescription>
            Unlock all features and get unlimited access to our support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" className="w-full" size="sm">
            Upgrade
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export { UpgradeProBanner }
