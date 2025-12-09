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

const createLinkSchema = z.object({
  originalUrl: z.url("Insira uma URL válida, ex.: 'https://...'"),
  clientId: z.string().min(1, "Selecione um cliente"),
  campaignId: z.string().optional(),
  tags: z.string().optional(),
});

type CreateLinkFormValues = z.infer<typeof createLinkSchema>;

export default function CreateLinkForm() {
  const router = useRouter();

  // Hooks de dados
  const { data: clients } = useClients();
  const { data: campaigns } = useCampaigns();

  // Hook de criação
  const { mutate, isPending } = useCreateLink(() => {
    router.push("/dashboard/links");
  });

  // Formulário
  const form = useForm<CreateLinkFormValues>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      originalUrl: "",
      clientId: "",
      campaignId: "",
      tags: "",
    },
  });

  function onSubmit(data: CreateLinkFormValues) {
    const tagsArray = data.tags
      ? data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    mutate({
      originalUrl: data.originalUrl,
      clientId: data.clientId,
      campaignId: data.campaignId || null,
      tags: tagsArray,
    });
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
              {/* 2. Cliente */}
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 3. Campanha */}
              <FormField
                control={form.control}
                name="campaignId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campanha</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {campaigns?.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Input
                      placeholder="whatsapp, instagram, black friday"
                      {...field}
                      className="h-11"
                    />
                  </FormControl>
                  <FormDescription>Separe as tags por vírgula.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ações (Rodapé do Form) */}
            <div className="flex items-center justify-end gap-4 border-t pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="text-muted-foreground"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="bg-macondo-red-500 hover:bg-macondo-red-600 px-8 font-semibold"
              >
                {isPending && (
                  <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
                )}
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
