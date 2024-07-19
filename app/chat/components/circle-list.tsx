import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CircleListProps {
  className?: string
}

export function CircleList({ className }: CircleListProps) {
  return (
    <div
      className={cn(
        'flex w-64 flex-col gap-4 border-r bg-muted/20 p-4',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Circles</div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <PlusIcon className="h-4 w-4" />
          <span className="sr-only">New Circle</span>
        </Button>
      </div>
      <div>
        <Input
          placeholder="Search circles..."
          className="h-8 w-full rounded-md bg-background pl-8"
        />
      </div>
      <div className="flex flex-col gap-2 overflow-auto">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg bg-muted p-2 hover:bg-muted/50"
          prefetch={false}
        >
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 gap-0.5">
            <p className="text-sm font-medium leading-none">Family</p>
            <p className="text-xs text-muted-foreground">
              Hey, hows it going? 🙂 &middot; 2h
            </p>
          </div>
          <div className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
            3
          </div>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50"
          prefetch={false}
        >
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 gap-0.5">
            <p className="text-sm font-medium leading-none">Work</p>
            <p className="text-xs text-muted-foreground">
              Just finished a great project! 🎉 &middot; 45m
            </p>
          </div>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50"
          prefetch={false}
        >
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>MG</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 gap-0.5">
            <p className="text-sm font-medium leading-none">Friends</p>
            <p className="text-xs text-muted-foreground">
              Excited for the weekend! 🎉 &middot; 1h
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
