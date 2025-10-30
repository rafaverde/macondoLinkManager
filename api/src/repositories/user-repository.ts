import { Prisma, User } from "@prisma/client";

// DTO (Data Transfer Object) para criar um usuário
export type CreateUserDTO = Prisma.UserCreateInput;

// Interface que define as obrigações de um repositório de usuário
export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>; // Procura um usuário por email
  create(data: CreateUserDTO): Promise<User>; // Cria um novo usuário
}
