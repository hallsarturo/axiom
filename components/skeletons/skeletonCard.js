import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="flex flex-col justify-center gap-4 space-y-3">
      <Skeleton className="h-[250px] w-[350px] sm:w-[600px] md:w-[650px] rounded-xl mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] mb-4" />
        <Skeleton className="h-4 w-[200px] mb-4" />
      </div>
    </div>
  )
}