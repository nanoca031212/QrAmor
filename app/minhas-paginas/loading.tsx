import { Heart, Settings } from "lucide-react";

export default function MinhasPaginasLoading() {
  return (
    <main className="relative min-h-screen bg-[#09090b] overflow-hidden">
      {/* Background gradients */}
      <div className="absolute left-[-88px] top-24 h-[280px] w-[280px] rounded-full bg-fuchsia-500/20 blur-[95px] -z-10" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[120px] -z-10" />

      {/* Header Skeleton */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-white/10 animate-pulse" />
            <div className="w-24 h-5 rounded bg-white/10 animate-pulse" />
          </div>
          <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
        </div>
      </header>

      {/* Content Skeleton */}
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex items-start justify-between mb-10">
          <div className="space-y-3">
            <div className="w-64 h-8 rounded-lg bg-white/10 animate-pulse" />
            <div className="w-48 h-4 rounded-md bg-white/5 animate-pulse" />
          </div>
          <div className="w-32 h-10 rounded-full bg-white/10 animate-pulse" />
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4 animate-pulse"
            >
              <div className="w-3/4 h-5 rounded bg-white/10" />
              <div className="w-1/2 h-3 rounded bg-white/5" />
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="w-20 h-4 rounded bg-white/5" />
                <div className="w-24 h-8 rounded-md bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
