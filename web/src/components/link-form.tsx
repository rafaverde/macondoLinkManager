"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCampaigns } from "@/hooks/use-campaigns";
import { useClients } from "@/hooks/use-clients";
import { useCreateLink } from "@/hooks/use-create-link";
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
import CreateClientDialog from "./create-client-dialog";
import CreateCampaignDialog from "./create-campaign-dialog";
import { InputTags } from "./ui/input-tags";
import { Link } from "@/types";
import { useUpdateLink } from "@/hooks/use-update-link";

const linkFormSchema = z.object({
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
  const isEditing = !!initialData;

  // Hooks de dados
  const { data: clients } = useClients();

  // Hook de criação e edição (Mutations)
  const createMutation = useCreateLink(() => router.push("/dashboard/links"));
  const updateMutation = useUpdateLink(() => router.push("/dashboard/links"));

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Formulário com Default Values inteligentes
  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      originalUrl: initialData?.originalUrl || "",
      clientId: initialData?.clientId || "",
      campaignId: initialData?.campaignId || "",
      tags: [],
    },
  });

  // Assistir o valor do campo "clientId" e passa para o hook de campanhas
  const selectedClientId = form.watch("clientId");
  const { data: campaigns, isLoading: isLoadingCampaigns } =
    useCampaigns(selectedClientId);

  function onSubmit(data: LinkFormValues) {
    if (isEditing && initialData) {
      // Modo Edição
      updateMutation.mutate({
        id: initialData.id,
        originalUrl: data.originalUrl,
        clientId: data.clientId,
        campaignId: data.campaignId || null,
      });
    } else {
      // Modo criação
      createMutation.mutate({
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
                          {clients?.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <CreateClientDialog
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
                          {campaigns?.length === 0 ? (
                            <div className="text-muted-foreground p-2 text-center text-sm">
                              Nenhuma campanha encontrada.
                            </div>
                          ) : (
                            campaigns?.map((campaign) => (
                              <SelectItem key={campaign.id} value={campaign.id}>
                                {campaign.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <CreateCampaignDialog
                        clientId={form.watch("clientId")}
                        onSelectNew={(id) => field.onChange(id)}
                      />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 4. Tags */}
            {!isEditing && (
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
                    <FormDescription>
                      Separe as tags por vírgula.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
