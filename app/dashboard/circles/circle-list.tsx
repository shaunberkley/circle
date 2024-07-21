'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { PagingProvider, usePaging, Paging } from '@/components/paging'

import { SearchForm } from './components/search-form'
import { HeadLink } from './components/head-link'
import { QuickEdit, QuickView } from './components/quick-links'
import {
  BulkActions,
  BulkActionsProvider,
  useBulkActions,
} from './components/bulk-actions'

import { cn } from '@/lib/utils'
import { Circle } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { useCirclesAPI } from '@/queries/client/circles'
import { CheckedState } from '@radix-ui/react-checkbox'

const CircleList = () => {
  const searchParams = useSearchParams()
  const page = +((searchParams.get('page') as string) ?? '1')
  const perPage = +((searchParams.get('perPage') as string) ?? '10')
  const pageSize = +((searchParams.get('pageSize') as string) ?? '10')
  const isPublic = searchParams.get('isPublic') === 'true'
  const q = searchParams.get('q') as string
  const orderBy = (searchParams.get('orderBy') as string) ?? 'id'
  const order = (searchParams.get('order') as string) ?? 'desc'

  const { user } = useAuth()
  const { count } = useCirclesAPI(user?.id ?? null, {
    page,
    perPage,
    isPublic,
    q,
    orderBy,
    order,
  })

  const total = count ?? 0

  return (
    <PagingProvider
      value={{
        total,
        page,
        perPage,
        pageSize,
        isPublic,
        q,
        orderBy,
        order,
      }}
    >
      <BulkActionsProvider>
        <Header />
        <Body />
        <Footer />
      </BulkActionsProvider>
    </PagingProvider>
  )
}

const Header = () => {
  return (
    <div className="space-y-6">
      <HeadLinks />
      <div className="flex flex-wrap justify-between gap-2">
        <BulkActions className="w-full sm:w-auto" />
        <SearchForm className="w-full sm:w-auto" />
      </div>
    </div>
  )
}

interface HeadLinksProps extends React.HTMLAttributes<HTMLDivElement> {}

const HeadLinks = ({ className, ...props }: HeadLinksProps) => {
  const paging = usePaging()
  const { user } = useAuth()

  return (
    <div
      className={cn(
        'flex flex-wrap items-center space-x-1 text-sm text-muted-foreground',
        className
      )}
      {...props}
    >
      <HeadLink status="public" label="public" count={status?.public ?? 0} />
      <span>|</span>
      <HeadLink status="private" label="private" count={status?.private ?? 0} />
    </div>
  )
}

const Body = () => {
  const { t } = useTranslation()

  const paging = usePaging()
  const { user } = useAuth()
  const { circles } = useCirclesAPI(user?.id ?? null, {
    page: paging?.page,
    perPage: paging?.perPage,
    isPublic: paging?.isPublic,
    q: paging?.q,
    orderBy: paging?.orderBy,
    order: paging?.order,
  })

  const { checks, setChecks } = useBulkActions()

  React.useEffect(() => {
    setChecks([])
  }, [paging, setChecks])

  return (
    <Table className="border-t">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={checks?.length > 0 && checks?.length === circles?.length}
              onCheckedChange={(checked: CheckedState) => {
                setChecks(checked && circles ? circles : [])
              }}
            />
          </TableHead>
          <TableHead className="min-w-[70px] text-center">{t('num')}</TableHead>
          <TableHead className="min-w-[250px]">{t('name')}</TableHead>
          <TableHead className="min-w-[100px] text-center">
            {t('owner')}
          </TableHead>
          <TableHead className="min-w-[200px] text-center">
            {t('created_at')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {circles === null ? (
          <LoadingItem />
        ) : Array.isArray(circles) && circles?.length > 0 ? (
          circles?.map((circle: Circle) => (
            <CircleItem key={circle?.id} circle={circle} />
          ))
        ) : (
          <EmptyItem />
        )}
      </TableBody>
    </Table>
  )
}

const CircleItem = ({ circle }: { circle: Circle }) => {
  const { t } = useTranslation()
  const { checks, setChecks } = useBulkActions()

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={checks?.some((x: Circle) => x.id === circle?.id)}
          onCheckedChange={(checked: CheckedState) => {
            const value = checked
              ? [...checks, circle]
              : checks?.filter((x: Circle) => x.id !== circle?.id)
            setChecks(value)
          }}
        />
      </TableCell>
      <TableCell align="center">{circle?.num}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          {dayjs().isBefore(dayjs(circle?.created_at).add(1, 'day')) ? (
            <span className="font-bold text-destructive text-2xs dark:text-white">
              NEW
            </span>
          ) : null}
          <div className="line-clamp-1">
            <span>
              {!circle?.is_public ? `[${t('private')}] ` : `[${t('public')}] `}
            </span>
            <span className="break-all">{circle?.name}</span>
          </div>
        </div>
        <QuickLinks circle={circle} />
      </TableCell>
      <TableCell align="center">{circle?.owner?.full_name}</TableCell>
      <TableCell align="center">
        {dayjs(circle?.created_at).format('YYYY-MM-DD HH:mm:ss')}
      </TableCell>
    </TableRow>
  )
}

interface QuickLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  circle: Circle
}

const QuickLinks = ({ circle, ...props }: QuickLinksProps) => {
  return (
    <div className="space-x-1" {...props}>
      <QuickEdit circle={circle} />
      <span>|</span>
      <QuickView circle={circle} />
    </div>
  )
}

const EmptyItem = () => {
  const { t } = useTranslation()

  return (
    <TableRow className="hover:bg-inherit">
      <TableCell colSpan={5} align="center">
        {t('no_circles_yet')}
      </TableCell>
    </TableRow>
  )
}

const LoadingItem = () => {
  const { t } = useTranslation()

  return (
    <TableRow className="hover:bg-inherit">
      <TableCell colSpan={5} align="center">
        {t('is_loading')}
      </TableCell>
    </TableRow>
  )
}

const Footer = () => {
  const paging = usePaging()
  const { user } = useAuth()
  const { circles } = useCirclesAPI(user?.id ?? null, {
    page: paging?.page,
    perPage: paging?.perPage,
    isPublic: paging?.isPublic,
    q: paging?.q,
    orderBy: paging?.orderBy,
    order: paging?.order,
  })

  if (!circles) return null

  return <Paging />
}

export { CircleList }
