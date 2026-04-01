"use client";

import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isDisabled?: boolean;
}

export function PaginationControls({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  isDisabled = false,
}: PaginationControlsProps) {
  if (total === 0) {
    return null;
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm lg:flex-row">
      <p className="text-muted-foreground">
        Mostrando {start}-{end} de {total} item(ns)
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(page - 1)}
          disabled={isDisabled || page <= 1}
        >
          Anterior
        </Button>
        <span className="text-muted-foreground min-w-24 text-center">
          Página {page} de {Math.max(totalPages, 1)}
        </span>
        <Button
          variant="outline"
          onClick={() => onPageChange(page + 1)}
          disabled={isDisabled || page >= totalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}

