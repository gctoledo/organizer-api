import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { TripRepository } from '@/repositories/interfaces/trips-repository'

interface GetTripUseCaseParams {
  tripId: string
  credential: string // user id or participant email
}

export class GetTripUseCase {
  constructor(private tripRepository: TripRepository) {}

  async execute({ tripId, credential }: GetTripUseCaseParams) {
    const trip = await this.tripRepository.findById(tripId)

    if (!trip) {
      throw new NotFoundError('Trip')
    }

    const authorization =
      trip.userId === credential ||
      trip.participants.some((participant) => participant.email === credential)

    if (!authorization) {
      throw new UnauthorizedError()
    }

    return { trip }
  }
}
