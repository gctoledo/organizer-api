import { EmailAlreadyExistsError } from '@/errors/users/EmailAlreadyExists'
import { ICrypto } from '@/helpers/crypto'
import { UserRepository } from '@/repositories/interfaces/users-repository'
import { User } from '@prisma/client'

interface CreateUserUseCaseParams {
  first_name: string
  last_name: string
  password: string
  email: string
}

export class CreateUserUseCase {
  constructor(
    private crypto: ICrypto,
    private userRepository: UserRepository,
  ) {}

  async execute({
    email,
    first_name,
    last_name,
    password,
  }: CreateUserUseCaseParams): Promise<User> {
    const emailAlreadyExists = await this.userRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError()
    }

    const hashedPassword = await this.crypto.hash(password)

    const user = await this.userRepository.create({
      email,
      first_name,
      last_name,
      password: hashedPassword,
    })

    return user
  }
}
