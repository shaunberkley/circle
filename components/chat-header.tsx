import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MoveHorizontalIcon, PhoneIcon, VideoIcon } from "lucide-react";

export function ChatHeader() {
  return (
    <div className="border-b p-3 flex items-center">
      <div className="flex items-center gap-2">
        <Avatar className="border w-10 h-10">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <p className="text-sm font-medium leading-none">Family</p>
          <p className="text-xs text-muted-foreground">Active 2h ago</p>
        </div>
      </div>
      <div className="flex items-center gap-1 ml-auto">
        <Button variant="ghost" size="icon">
          <span className="sr-only">Call</span>
          <PhoneIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <span className="sr-only">Video call</span>
          <VideoIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <span className="sr-only">More</span>
          <MoveHorizontalIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
