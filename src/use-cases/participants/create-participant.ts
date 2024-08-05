import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { ParticipantsRepository } from '@/repositories/interfaces/participants-repository'
import { TripRepository } from '@/repositories/interfaces/trips-repository'

interface CreateParticipantUseCaseParams {
  userId: string
  tripId: string
  email: string
  first_name?: string
}

export class CreateParticipantUseCase {
  constructor(
    private participantsRepository: ParticipantsRepository,
    private tripsRepository: TripRepository,
  ) {}

  async execute({
    userId,
    tripId,
    email,
    first_name,
  }: CreateParticipantUseCaseParams) {
    const trip = await this.tripsRepository.findById(tripId)

    if (!trip) {
      throw new NotFoundError('Trip')
    }

    if (trip.userId !== userId) {
      throw new UnauthorizedError()
    }

    const participant = await this.participantsRepository.create({
      email,
      first_name,
      tripId: trip.id,
    })

    return { participant }
  }
}
