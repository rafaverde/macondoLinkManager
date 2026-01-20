import { Skeleton } from "./ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between border-b pb-8">
        <Skeleton className="bg-muted-foreground/50 h-11 w-[300px]" />

        <Skeleton className="bg-muted-foreground/50 h-10 w-30 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 grid-rows-2 space-y-4 py-8 lg:grid-cols-3 lg:grid-rows-1 lg:gap-4 lg:space-y-0">
        <div className="flex w-full flex-col gap-4 lg:col-span-1">
          <Skeleton className="bg-muted-foreground/50 h-[115px] w-full rounded-xl" />
          <Skeleton className="bg-muted-foreground/50 h-[115px] w-full rounded-xl" />
        </div>
        <Skeleton className="bg-muted-foreground/50 col-span-2 h-full w-full rounded-xl" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="bg-muted-foreground/50 h-100 w-full rounded-xl" />
        <Skeleton className="bg-muted-foreground/50 h-100 w-full rounded-xl" />
      </div>
    </>
  );
}
