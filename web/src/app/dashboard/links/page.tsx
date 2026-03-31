"use client";

import LinkCard from "@/components/link-card";
import LinkCardSkeleton from "@/components/link-card-skeleton";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import {
  RiAddLine,
  RiCloseLine,
  RiLinkUnlink,
  RiSearchLine,
} from "@remixicon/react";

import { useCampaigns } from "@/features/campaigns/hooks/use-campaigns";
import { useClients } from "@/features/clients/hooks/use-clients";
import { useDebounce } from "@/hooks/use-debounce";
import { useLinks } from "@/features/links/hooks/use-links";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useBreadcrumb } from "@/contexts/breadcrumb-context";
import { PaginationControls } from "@/components/pagination-controls";

export default function LinksPage() {
  const { setItems } = useBreadcrumb();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [page, setPage] = useState(1);
  const debounceSearch = useDebounce(searchTerm, 500);
  const pageSize = 20;
  const selectionPageSize = 100;

  const { data: clients } = useClients({ pageSize: selectionPageSize });
  const { data: campaigns } = useCampaigns({ pageSize: selectionPageSize });

  const { data: links, isLoading } = useLinks({
    search: debounceSearch,
    // Só envia id se não for "all"
    clientId: selectedClient === "all" ? undefined : selectedClient,
    campaignId: selectedCampaign === "all" ? undefined : selectedCampaign,
    page,
    pageSize,
  });

  const campaignsForSelect = useMemo(() => {
    if (selectedClient === "all") return campaigns?.items;
    return campaigns?.items.filter(
      (campaign) => campaign.clientId === selectedClient,
    );
  }, [campaigns, selectedClient]);

  // Limpa filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedClient("all");
    setSelectedCampaign("all");
    setPage(1);
  };

  // Gera breadcrumb
  useEffect(() => {
    setItems([{ label: "Dashboard", href: "/dashboard" }, { label: "Links" }]);
  }, [setItems]);

  return (
    <>
      <div className="flex items-center justify-between border-b pb-8">
        <h2 className="text-4xl font-bold">Meus links</h2>
        <Link href="/dashboard/links/create">
          <Button size="lg">
            Novo Link
            <RiAddLine />
          </Button>
        </Link>
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-col items-center gap-2 border-b py-6 lg:flex-row">
        <span>Filtrar por:</span>

        {/* Filtros por digitação */}
        <div className="flex w-full flex-1">
          <InputGroup>
            <InputGroupInput
              placeholder="Buscar por link, código..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
            <InputGroupAddon align="inline-start">
              <RiSearchLine />
            </InputGroupAddon>
            {searchTerm && (
              <InputGroupAddon
                onClick={handleClearFilters}
                align="inline-end"
                className="cursor-pointer"
              >
                <RiCloseLine className="select-none" />
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>

        {/* Filtro por cliente */}
        <Select
          value={selectedClient}
          onValueChange={(value) => {
            setSelectedClient(value);
            setSelectedCampaign("all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full lg:w-[200px]">
            <SelectValue placeholder="Selecione o cliente..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Clientes</SelectLabel>
              <SelectItem value="all">Todos os clientes</SelectItem>
              {clients?.items.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Filtro por campanha */}
        <Select
          value={selectedCampaign}
          onValueChange={(value) => {
            setSelectedCampaign(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full lg:w-[200px]">
            <SelectValue placeholder="Selecione o cliente..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Campanhas</SelectLabel>
              <SelectItem value="all">Todas as campanhas</SelectItem>
              {campaignsForSelect?.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          size="icon"
          variant="outline"
          disabled={
            selectedCampaign === "all" &&
            selectedClient === "all" &&
            !searchTerm
          }
          onClick={handleClearFilters}
        >
          <RiCloseLine />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4 py-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <LinkCardSkeleton key={i} />
          ))}
        </div>
      ) : links?.items.length === 0 ? (
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-2 py-20">
          <RiLinkUnlink className="text-primary size-10" />
          <h3 className="text-3xl font-bold">Nenhum link econtrado.</h3>
          <p className="mb-6 text-center text-sm">
            Cadastre um novo link ou tente ajustar ou limpar os filtros da
            pesquisa.
          </p>
          <Button onClick={handleClearFilters}>Limpar filtros</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 py-8">
          {links?.items.map((link) => (
            <LinkCard link={link} key={link.id} />
          ))}

          {links && (
            <PaginationControls
              page={links.page}
              pageSize={links.pageSize}
              total={links.total}
              totalPages={links.totalPages}
              onPageChange={setPage}
              isDisabled={isLoading}
            />
          )}
        </div>
      )}
    </>
  );
}
