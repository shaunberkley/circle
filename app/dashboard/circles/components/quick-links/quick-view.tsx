'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Circle } from '@/types/database'

interface QuickViewProps {
  circle: Circle
}

const QuickView = ({ circle }: QuickViewProps) => {
  const { t } = useTranslation()

  return (
    <Link
      href={`/circles/${circle?.id}/chat`}
      className="text-xs text-blue-700 hover:underline dark:text-white"
    >
      {t('view')}
    </Link>
  )
}

export { QuickView, type QuickViewProps }
