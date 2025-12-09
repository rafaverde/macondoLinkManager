import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function LinkCardSkeleton() {
  return (
    <>
      <Card className="group flex shadow-xs transition-all duration-200 hover:shadow-sm">
        <CardContent className="flex flex-col gap-6 md:flex-row">
          <Skeleton className="size-12 rounded-full" />

          <div className="flex-1">
            <div>
              <Skeleton className="mb-2 h-7 w-[250]" />
              <Skeleton className="h-4 w-40" />

              <div className="text-muted-foreground group/link flex cursor-pointer gap-1 py-1 select-none">
                <Skeleton className="size-6" />
                <Skeleton className="h-6 w-12" />
              </div>

              <div className="text-muted-foreground flex gap-1 text-xs">
                <Skeleton className="size-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm md:flex-row md:gap-8">
              <div className="text-primary flex items-start gap-1 font-bold md:items-center">
                <Skeleton className="size-4" />
                <Skeleton className="h-4 w-10" />
              </div>

              <div className="text-macondo-gray-400 flex items-center gap-1">
                <Skeleton className="size-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="size-9" />
            <Skeleton className="size-9" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
