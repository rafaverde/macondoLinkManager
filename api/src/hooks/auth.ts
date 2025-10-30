import { FastifyReply, FastifyRequest } from "fastify";

// Função de proteção
export async function authHook(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Pega o token do cookie "macondo.token"
    const token = request.cookies["macondo.token"];

    if (!token) {
      // Se não houver token, bloqueia
      return reply
        .status(401)
        .send({ message: "Token de autenticação não fornecido." });
    }

    // Valida o token JWT
    // O 'app.jwt.verify' (que registramos no server.ts)
    // vai ler o token, checar a assinatura com o nosso JWT_SECRET
    // e verificar se não está expirado.
    // Se for válido, ele retorna o 'payload' (o que guardamos nele).
    const userData = await request.jwt.verify(token);

    // Anexa os dados do usuário à requisição para usarmos nossos controllers
    request.user = userData;
  } catch (err) {
    // Se o token for inválido (expirado, assinatura errada),
    // o '.verify()' vai dar um erro.
    console.error("Erro na verificação do JWT:", err);
    return reply.status(401).send({ message: "Token inválido ou expirado." });
  }
}
