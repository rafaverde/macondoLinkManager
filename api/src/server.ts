import Fastify from 'fastify'
import { prisma } from './lib/prisma' // Importamos nossa instância do Prisma

// 1. Inicializa o Fastify
const app = Fastify({
  logger: true, // Habilita o logger do Fastify (ótimo para dev)
})

// 2. Criação da Rota "Health Check"
// Esta rota é essencial para sabermos se a API está online
// e se consegue acessar o banco de dados.
app.get('/health', async (request, reply) => {
  try {
    // Tenta fazer uma query simples no banco
    // O Prisma faz um "SELECT 1" para testar a conexão
    await prisma.$queryRaw`SELECT 1`
    
    // Se funcionou, retorna status 200
    return reply.status(200).send({ 
      status: 'ok', 
      dbConnection: 'healthy' 
    })
  } catch (error) {
    // Se falhou (ex: banco offline), retorna status 503
    console.error('Falha na conexão com o banco:', error)
    return reply.status(503).send({ 
      status: 'error', 
      dbConnection: 'unhealthy' 
    })
  }
})

// 3. Função para Iniciar o Servidor
const start = async () => {
  try {
    // O host '0.0.0.0' é crucial para o Docker
    // Significa "ouvir em todas as interfaces de rede" dentro do container
    await app.listen({ port: 3333, host: '0.0.0.0' })
    
    console.log(`🚀 Servidor rodando em http://localhost:3333`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

// 4. Executa a função de início
start()