import { NotFoundError } from '@/errors/users/NotFound'
import { UserRepository } from '@/repositories/interfaces/users-repository'

export class GetProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new NotFoundError('User')
    }

    return user
  }
}
