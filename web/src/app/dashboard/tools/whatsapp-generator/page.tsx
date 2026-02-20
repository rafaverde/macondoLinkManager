"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBreadcrumb } from "@/contexts/breadcrumb-context";
import { handleCopyLink } from "@/lib/link-share";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiFileCopyLine } from "@remixicon/react";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const waGeneratorSchema = z.object({
  ddi: z
    .string()
    .trim()
    .min(1, "Informe o DDI")
    .max(3, "Máximo de 3 dígitos")
    .regex(/^\d+$/, "Apenas números"),
  ddd: z
    .string()
    .trim()
    .max(5, "Máximo de 5 dígitos")
    .refine((val) => val === "" || /^\d+$/.test(val), "Apenas números"),
  phone: z
    .string()
    .trim()
    .min(6, "Telefone inválido")
    .regex(/^\d+$/, "Apenas números"),
  message: z
    .string()
    .trim()
    .transform((val) => val ?? ""),
});

type WhatsAppFormData = z.infer<typeof waGeneratorSchema>;

export default function WhatsAppGeneratorPage() {
  const { setItems } = useBreadcrumb();

  // Gera breadcrumb
  useEffect(() => {
    setItems([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Tools" },
      { label: "Gerador Link WhatsApp" },
    ]);
  }, [setItems]);

  // Form
  const {
    watch,
    register,
    formState: { errors, isValid },
  } = useForm<WhatsAppFormData>({
    resolver: zodResolver(waGeneratorSchema),
    mode: "onChange",
    defaultValues: {
      ddi: "",
      ddd: "",
      phone: "",
      message: "",
    },
  });

  const values = watch();

  // Link Generator
  const generatedLink = useMemo(() => {
    if (!values.ddi || !values.phone) return "";

    const fullNumber = `${values.ddi}${values.ddd}${values.phone}`;
    const trimmedMessage = values.message?.trim();

    if (!trimmedMessage) {
      return `https://wa.me/${fullNumber}`;
    }

    return `https://wa.me/${fullNumber}?text=${encodeURIComponent(trimmedMessage)}`;
  }, [values, isValid]);

  return (
    <>
      <div className="flex flex-col justify-between space-y-2 border-b pb-8">
        <h2 className="text-4xl font-bold">Gerador de link para Whatsapp</h2>
        <p className="text-muted-foreground text-sm">
          Gere links oficiais da API do WhatsApp para compartilhar com clientes.
        </p>
      </div>

      {/* Link Generator Form */}
      <div className="border-muted-foreground/20 mx-auto mt-8 rounded-2xl border p-6">
        <div className="grid grid-cols-1 gap-4 py-8 md:grid-cols-5">
          {/* DDI */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Código País
            </label>
            <Input placeholder="55" {...register("ddi")} inputMode="numeric" />
            {errors.ddi && (
              <p className="text-destructive mt-1 text-xs">
                {errors.ddi.message}
              </p>
            )}
          </div>

          {/* DDD */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Código de Área
            </label>
            <Input placeholder="84" {...register("ddd")} inputMode="numeric" />
            {errors.ddd && (
              <p className="text-destructive mt-1 text-xs">
                {errors.ddd.message}
              </p>
            )}
          </div>

          <div className="md:col-span-3">
            <label className="mb-1 block text-sm font-medium">Telefone</label>
            <Input
              placeholder="999999999"
              {...register("phone")}
              inputMode="numeric"
            />
            {errors.phone && (
              <p className="text-destructive mt-1 text-xs">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="md:col-span-5">
            <label className="mb-1 block text-sm font-medium">Mensagem</label>
            <Textarea
              placeholder="Digite a mensagem a ser enviada..."
              rows={4}
              {...register("message")}
            />
          </div>

          {/* Preview Area */}
          <div className="md:col-span-5">
            <h3 className="mb-1 block text-sm font-medium">Link preview:</h3>
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="bg-muted-foreground/10 border-muted-foreground/50 flex-1 rounded-lg border px-4 py-2">
                <Link href="" onClick={() => handleCopyLink(generatedLink)}>
                  <span className="text-primary font-semibold break-all">
                    {generatedLink}
                  </span>
                </Link>
              </div>

              <Button onClick={() => handleCopyLink(generatedLink)} size="lg">
                <RiFileCopyLine /> Copiar link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
