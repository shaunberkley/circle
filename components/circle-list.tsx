import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ToggleMode } from "@/components/toggle-mode";
import { PlusIcon } from "lucide-react";

export function CircleList() {
  return (
    <div className="hidden lg:flex bg-muted/20 border-r w-64 p-4 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="font-medium text-sm">Circles</div>
        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
          <PlusIcon className="h-4 w-4" />
          <span className="sr-only">New Circle</span>
        </Button>
      </div>
      <div>
        <Input placeholder="Search circles..." className="h-8 w-full rounded-md bg-background pl-8" />
      </div>
      <div className="flex flex-col gap-2 overflow-auto">
        <Link href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 bg-muted" prefetch={false}>
          <Avatar className="border w-10 h-10">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="flex-1 grid gap-0.5">
            <p className="text-sm font-medium leading-none">Family</p>
            <p className="text-xs text-muted-foreground">Hey, how's it going? 🙂 &middot; 2h</p>
          </div>
          <div className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium">3</div>
        </Link>
        <Link href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50" prefetch={false}>
          <Avatar className="border w-10 h-10">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div className="flex-1 grid gap-0.5">
            <p className="text-sm font-medium leading-none">Work</p>
            <p className="text-xs text-muted-foreground">Just finished a great project! 🎉 &middot; 45m</p>
          </div>
        </Link>
        <Link href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50" prefetch={false}>
          <Avatar className="border w-10 h-10">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>MG</AvatarFallback>
          </Avatar>
          <div className="flex-1 grid gap-0.5">
            <p className="text-sm font-medium leading-none">Friends</p>
            <p className="text-xs text-muted-foreground">Excited for the weekend! 🎉 &middot; 1h</p>
          </div>
        </Link>
      </div>
      <div className="mt-auto">
        <ToggleMode />
      </div>
    </div>
  );
}
