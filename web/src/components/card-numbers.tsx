import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RemixiconComponentType } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface CardNumbersProps extends React.ComponentProps<typeof Card> {
  title: string;
  value: string | number | undefined;
  icon?: RemixiconComponentType;
  description?: string;
  isLoading?: boolean;
}

export default function CardNumbers({
  title,
  value,
  icon: Icon,
  description,
  isLoading,
  className,
  ...props
}: CardNumbersProps) {
  if (isLoading) {
    return (
      <Skeleton
        className={cn(
          "bg-card flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-xl",
          className,
        )}
      >
        <div className="flex gap-2">
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-5 w-20" />
        </div>

        <Skeleton className="h-10 w-40" />

        <Skeleton className="h-5 w-60" />
      </Skeleton>
    );
  }

  return (
    <Card
      className={cn("gap-1 shadow-xs hover:shadow-sm", className)}
      {...props}
    >
      <CardHeader className="flex items-center justify-center gap-2">
        {Icon && <Icon className="text-primary size-4" />}
        <CardTitle className="text-muted-foreground">{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center gap-1">
        <h3 className="text-primary text-5xl font-bold">{value}</h3>
        {description && (
          <p className="text-muted-foreground/70 text-center text-xs">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
