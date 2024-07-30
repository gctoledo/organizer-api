import { EmailAlreadyExistsError } from '@/errors/users/email-already-exists'
import { ICrypto } from '@/helpers/crypto'
import { UserRepository } from '@/repositories/interfaces/users-repository'
import { User } from '@prisma/client'

interface CreateUserUseCaseParams {
  first_name: string
  last_name: string
  password: string
  email: string
}

interface CreateUserUseCaseResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private crypto: ICrypto,
  ) {}

  async execute({
    email,
    first_name,
    last_name,
    password,
  }: CreateUserUseCaseParams): Promise<CreateUserUseCaseResponse> {
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

    return { user }
  }
}
