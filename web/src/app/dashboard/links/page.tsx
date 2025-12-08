"use client";

import LinkCard from "@/components/link-card";
import LinkCardSkeleton from "@/components/link-card-skeleton";
import { Button } from "@/components/ui/button";
import { useLinks } from "@/hooks/use-links";
import { RiArrowRightLine } from "@remixicon/react";

export default function DashboardPage() {
  const { data: links, isLoading } = useLinks();

  return (
    <>
      <div className="flex items-center justify-between border-b pb-8">
        <h2 className="text-4xl font-bold">Meus links</h2>
        <Button size="lg">
          Novo Link
          <RiArrowRightLine />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4 py-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <LinkCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 py-8">
          {links?.map((link) => (
            <LinkCard link={link} key={link.id} />
          ))}
        </div>
      )}
    </>
  );
}
