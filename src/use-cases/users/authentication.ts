import { InvalidCredentialsError } from '@/errors/invalid-credentials'
import { Crypto } from '@/helpers/crypto'
import { UserRepository } from '@/repositories/interfaces/users-repository'
import { User } from '@prisma/client'

interface AuthenticationUseCaseParams {
  email: string
  password: string
}

interface AuthenticationUseCaseResponse {
  user: User
}

export class AuthenticationUseCase {
  constructor(
    private userRepository: UserRepository,
    private crypto: Crypto,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticationUseCaseParams): Promise<AuthenticationUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await this.crypto.compare({
      hashedPassword: user.password,
      password,
    })

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
