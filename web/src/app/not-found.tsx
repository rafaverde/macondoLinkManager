import { Button } from "@/components/ui/button";
import { RiArrowLeftLine, RiErrorWarningLine } from "@remixicon/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-background h-dvh w-full">
      <div className="container mx-auto flex h-full w-full flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center">
          <RiErrorWarningLine className="text-primary size-20 lg:size-40" />
          <h2 className="text-primary text-6xl font-black">404</h2>
          <p>Ops! A página que você está procurando não existe.</p>
        </div>

        <Link href="/dashboard">
          <Button size="lg">
            <RiArrowLeftLine />
            Voltar a Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
