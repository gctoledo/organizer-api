import { ParticipantsRepository } from '@/repositories/interfaces/participants-repository'

export class ConfirmParticipantUseCase {
  constructor(private participantRepository: ParticipantsRepository) {}

  async execute(id: string) {
    await this.participantRepository.confirm(id)
  }
}
