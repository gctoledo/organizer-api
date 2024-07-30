import { NotFoundError } from '@/errors/users/not-found'
import { UserRepository } from '@/repositories/interfaces/users-repository'
import { User } from '@prisma/client'

interface GetProfileUseCaseResponse {
  user: User
}

export class GetProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<GetProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new NotFoundError('User')
    }

    return { user }
  }
}
