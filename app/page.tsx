import { Chat } from '@/components/chat';

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-between">
      <div className="flex flex-1 w-full">
        <Chat />
      </div>
    </main>
  );
}
