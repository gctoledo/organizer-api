import { Prisma, User } from '@prisma/client'
import { UserRepository } from '../interfaces/users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID().toString(),
      ...data,
    }

    this.users.push(user)

    return user
  }
}
