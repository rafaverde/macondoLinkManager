import { env } from "./env";
import { buildApp } from "./app";

// Função para Iniciar o Servidor
const start = async () => {
  try {
    const app = await buildApp();

    // O host '0.0.0.0' é crucial para o Docker
    // Significa "ouvir em todas as interfaces de rede" dentro do container
    await app.listen({ port: env.PORT, host: "0.0.0.0" });

    console.log(`🚀 Servidor rodando em http://localhost:${env.PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Executa a função de início
start();
