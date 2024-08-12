import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { ParticipantsRepository } from '@/repositories/interfaces/participants-repository'
import { TripRepository } from '@/repositories/interfaces/trips-repository'

interface DeleteParticipantUseCaseParams {
  userId: string
  participantId: string
}

export class DeleteParticipantUseCase {
  constructor(
    private participantsRepository: ParticipantsRepository,
    private tripsRepository: TripRepository,
  ) {}

  async execute({ participantId, userId }: DeleteParticipantUseCaseParams) {
    const participant =
      await this.participantsRepository.findById(participantId)

    if (!participant) {
      throw new NotFoundError('Participant')
    }

    const trip = await this.tripsRepository.findById(participant.tripId)

    if (participant.owner === true) {
      throw new UnauthorizedError()
    }

    if (trip?.userId !== userId) {
      throw new UnauthorizedError()
    }

    await this.participantsRepository.delete(participantId)
  }
}
