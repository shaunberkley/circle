import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  ArrowUpRightIcon,
  CalendarIcon,
  ClipboardListIcon,
  ClockIcon,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ContextBarProps {
  className?: string
}

export function ContextBar({ className }: ContextBarProps) {
  return (
    <div
      className={cn(
        'flex w-64 flex-col gap-4 border-l bg-muted/20 p-4',
        className
      )}
    >
      <div className="text-sm font-medium">Active Users</div>
      <div className="flex flex-col gap-2 overflow-auto">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 gap-0.5">
            <p className="text-sm font-medium leading-none">Sofia Davis</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span>Typing...</span>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <ArrowUpRightIcon className="h-4 w-4" />
            <span className="sr-only">Jump to Latest</span>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 gap-0.5">
            <p className="text-sm font-medium leading-none">Alex Johnson</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span>Active 5m ago</span>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <ArrowUpRightIcon className="h-4 w-4" />
            <span className="sr-only">Jump to Latest</span>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>MG</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 gap-0.5">
            <p className="text-sm font-medium leading-none">Maria Gonzalez</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span>Active 15m ago</span>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <ArrowUpRightIcon className="h-4 w-4" />
            <span className="sr-only">Jump to Latest</span>
          </Button>
        </div>
      </div>
      <Separator />
      <div className="text-sm font-medium">Missed Content</div>
      <div className="flex flex-col gap-2 overflow-auto">
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Last Hour</p>
          </div>
          <p className="text-sm text-muted-foreground">
            You missed 3 new messages and 1 reaction.{' '}
            <Link href="#" className="text-primary" prefetch={false}>
              Catch up
            </Link>
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Last Day</p>
          </div>
          <p className="text-sm text-muted-foreground">
            You missed 12 new messages, 5 reactions, and 2 threads.{' '}
            <Link href="#" className="text-primary" prefetch={false}>
              Catch up
            </Link>
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Last Week</p>
          </div>
          <p className="text-sm text-muted-foreground">
            You missed 42 new messages, 18 reactions, and 8 threads.{' '}
            <Link href="#" className="text-primary" prefetch={false}>
              Catch up
            </Link>
          </p>
        </div>
      </div>
      <Separator />
      <div className="text-sm font-medium">AI Summaries</div>
      <div className="flex flex-col gap-2 overflow-auto">
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Project Update</p>
          </div>
          <p className="text-sm text-muted-foreground">
            The team discussed the latest progress on the new website launch.
            Key highlights include the completion of the design phase,
            successful integration of the e-commerce platform, and plans to
            begin user testing next week.
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Marketing Brainstorm</p>
          </div>
          <p className="text-sm text-muted-foreground">
            The marketing team held a productive brainstorming session to
            generate ideas for the upcoming product launch. They discussed
            various campaign strategies, including social media promotions,
            influencer partnerships, and targeted email outreach.
          </p>
        </div>
      </div>
    </div>
  )
}
