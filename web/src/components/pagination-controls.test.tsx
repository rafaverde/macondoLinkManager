import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaginationControls } from "./pagination-controls";

describe("PaginationControls", () => {
  it("mostra resumo da pagina atual e avança quando possível", () => {
    const onPageChange = vi.fn();

    render(
      React.createElement(PaginationControls, {
        page: 2,
        pageSize: 20,
        total: 45,
        totalPages: 3,
        onPageChange,
      }),
    );

    expect(screen.getByText("Mostrando 21-40 de 45 item(ns)")).toBeInTheDocument();
    expect(screen.getByText("Página 2 de 3")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Próxima" }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("desabilita navegação nos limites", () => {
    render(
      React.createElement(PaginationControls, {
        page: 1,
        pageSize: 20,
        total: 10,
        totalPages: 1,
        onPageChange: vi.fn(),
      }),
    );

    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Próxima" })).toBeDisabled();
  });
});
