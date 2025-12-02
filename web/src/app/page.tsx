import { RiWhatsappLine } from "@remixicon/react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-macondo-red-500 font-sans text-4xl font-bold">
        Macondo Link Manager
      </h1>
      <p className="text-macondo-gray-500">
        Testando a fonte Onest e as cores customizadas.
      </p>

      {/* Botão usando a classe semântica do shadcn (deve ser vermelho) */}
      <button className="bg-primary text-primary-foreground hover:bg-macondo-red-600 flex items-center gap-2 rounded-lg px-4 py-2 transition-colors">
        <RiWhatsappLine size={20} />
        <span>Botão Primário</span>
      </button>
    </div>
  );
}
