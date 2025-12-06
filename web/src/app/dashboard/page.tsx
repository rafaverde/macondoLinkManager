import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import CardNumbers from "@/components/ui/card-numbers";
import { RiArrowRightLine } from "@remixicon/react";

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between border-b pb-8">
        <h2 className="text-4xl font-bold">Resultados gerais</h2>
        <Button size="lg">
          Novo Link
          <RiArrowRightLine />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 py-8 lg:grid-cols-3">
        <div className="col-span-1 flex w-full flex-col gap-4">
          <CardNumbers
            title="Teste de card"
            value={1280}
            description="Teste de descrição do cardo abaixo do nújmero"
            icon={RiArrowRightLine}
          />
          <CardNumbers
            title="Teste de card"
            value={1280}
            description="Teste de descrição do cardo abaixo do nújmero"
            icon={RiArrowRightLine}
          />
        </div>

        <Card className="col-span-2">
          <CardHeader className="text-muted-foreground/50">
            Top 5 clientes por colume de cliques (Total)
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
