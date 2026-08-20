import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border-hairline">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-4 border-t border-border-hairline pt-3">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
