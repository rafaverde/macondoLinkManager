import { UsersRepository } from "../repositories/user-repository";
import { DomainNotAllowedError } from "./errors/domain-not-allowed-error";

// Domínios permitidos
const ALLOWED_DOMAINS = ["macondopropaganda.com", "macondo.com.uy"];

// DTO para os dados que recebemos do Google
interface GoogleuserInfo {
  email: string;
  name: string;
  picture: string;
}

export class AuthService {
  // O serviço recebe o repositório (dependency injection)
  constructor(private usersRepository: UsersRepository) {}

  // A principal lógica de negócio
  async authenticateWithGoogle(userInfo: GoogleuserInfo) {
    // 1. REGRA DE NEGÓCIO
    // Verifica se o domínio do email é permitido
    const userDomain = userInfo.email.split("@")[1];
    if (!ALLOWED_DOMAINS.includes(userDomain)) {
      // Se não for um email permitido, lança o erro customizado
      throw new DomainNotAllowedError();
    }

    // 2. Busca usuário no banco
    let user = await this.usersRepository.findByEmail(userInfo.email);

    // 3. Se não existir, cria
    if (!user) {
      user = await this.usersRepository.create({
        email: userInfo.email,
        name: userInfo.name,
        avatarUrl: userInfo.picture,
      });
    }

    // 4. Retorna o usuário, encontrado ou criado
    return user;
  }
}
