"use client";

import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCampaigns } from "@/features/campaigns/hooks/use-campaigns";
import { useClients } from "@/features/clients/hooks/use-clients";
import { useCreateLink } from "@/features/links/hooks/use-create-link";
import { Card, CardContent } from "./ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { RiLoader4Line } from "@remixicon/react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { InputTags } from "./ui/input-tags";
import { Link } from "@/types";
import { useUpdateLink } from "@/features/links/hooks/use-update-link";
import CreateClientInline from "./create-client-inline";
import { CreateCampaignInline } from "./create-campaign-inline";

const linkFormSchema = z.object({
  name: z.string().min(1, "Informe um nome para o link."),
  originalUrl: z.url("Insira uma URL válida, ex.: 'https://...'"),
  clientId: z.string().min(1, "Selecione um cliente"),
  campaignId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type LinkFormValues = z.infer<typeof linkFormSchema>;

interface LinkFormProps {
  initialData?: Link | null; // Se houver dados, é edição. Se não, é criação.
}

export default function LinkForm({ initialData }: LinkFormProps) {
  const router = useRouter();
  const selectionPageSize = 100;

  // Hooks de dados
  const { data: clients } = useClients({ pageSize: selectionPageSize });

  // Hook de criação e edição (Mutations)
  const createMutation = useCreateLink(() => router.push("/dashboard/links"));
  const updateMutation = useUpdateLink(() => router.push("/dashboard/links"));

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Formulário com Default Values inteligentes
  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      originalUrl: initialData?.originalUrl || "",
      clientId: initialData?.clientId || "",
      campaignId: initialData?.campaignId || "",
      tags: initialData?.tags?.map((tag) => tag.name) || [],
    },
  });

  // Assistir o valor do campo "clientId" e passa para o hook de campanhas
  const selectedClientId = useWatch({
    control: form.control,
    name: "clientId",
  });
  const { data: campaigns, isLoading: isLoadingCampaigns } =
    useCampaigns({
      clientId: selectedClientId,
      pageSize: selectionPageSize,
    });

  function onSubmit(data: LinkFormValues) {
    if (initialData) {
      // Modo Edição
      updateMutation.mutate({
        id: initialData.id,
        name: data.name,
        originalUrl: data.originalUrl,
        clientId: data.clientId,
        campaignId: data.campaignId || null,
        tags: data.tags || [],
      });
    } else {
      // Modo criação
      createMutation.mutate({
        name: data.name || "",
        originalUrl: data.originalUrl,
        clientId: data.clientId,
        campaignId: data.campaignId || null,
        tags: data.tags || [],
      });
    }
  }

  return (
    <Card className="">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Nome do Link*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex.: Portfolio Macondo Identidade Visual Cliente"
                      {...field}
                      className="h-12 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="originalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Url de destino*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.urldeexemplo.com.br"
                      {...field}
                      className="h-12 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid items-start gap-6 md:grid-cols-2">
              {/* Cliente */}
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <div className="flex gap-1">
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("campaignId", "");
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients?.items.length === 0 ? (
                            <div className="text-muted-foreground p-2 text-center text-sm">
                              Nenhum cliente encontrado.
                            </div>
                          ) : (
                            clients?.items.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>

                      <CreateClientInline
                        onSelectNew={(id) => field.onChange(id)}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campanha */}
              <FormField
                control={form.control}
                name="campaignId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campanha</FormLabel>
                    <div className="flex gap-1">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={!selectedClientId || isLoadingCampaigns}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue
                              placeholder={
                                !selectedClientId
                                  ? "Selecione primeiro um cliente"
                                  : "Selecione a campanha"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {campaigns?.items.length === 0 ? (
                            <div className="text-muted-foreground p-2 text-center text-sm">
                              Nenhuma campanha encontrada.
                            </div>
                          ) : (
                            campaigns?.items.map((campaign) => (
                              <SelectItem key={campaign.id} value={campaign.id}>
                                {campaign.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <CreateCampaignInline
                        clientId={selectedClientId}
                        onSelectNew={(id) => field.onChange(id)}
                      />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 4. Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <InputTags
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Digite e tecle enter"
                    />
                  </FormControl>
                  <FormDescription>Separe as tags por vírgula.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ações (Rodapé do Form) */}
            <div className="flex items-center justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.back()}
                className="text-muted-foreground"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="bg-macondo-red-500 hover:bg-macondo-red-600 min-w-[180px] px-8 font-semibold"
              >
                {isPending ? (
                  <>
                    <RiLoader4Line className="h-4 w-4 animate-spin" />
                    Salvando
                  </>
                ) : (
                  <>Salvar</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
