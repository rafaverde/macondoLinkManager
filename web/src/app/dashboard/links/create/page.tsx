"use client";

import CreateLinkForm from "@/components/create-link-form";
import { Button } from "@/components/ui/button";
import { RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";

export default function CreateLinkPage() {
  return (
    <>
      <div className="flex items-center justify-between border-b pb-8">
        <h2 className="text-4xl font-bold">Criar novo link</h2>
        <Link href="/dashboard/links">
          <Button size="lg">
            Voltar
            <RiArrowLeftLine />
          </Button>
        </Link>
      </div>

      <div className="py-8">
        <CreateLinkForm />
      </div>
    </>
  );
}
