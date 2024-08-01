import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { TripRepository } from '@/repositories/interfaces/trips-repository'

interface DeleteTripUseCaseParams {
  id: string
  ownerId: string
}

export class DeleteTripUseCase {
  constructor(private tripRepository: TripRepository) {}

  async execute({ id, ownerId }: DeleteTripUseCaseParams) {
    const trip = await this.tripRepository.findById(id)

    if (!trip) {
      throw new NotFoundError('Trip')
    }

    if (trip.userId !== ownerId) {
      throw new UnauthorizedError()
    }

    await this.tripRepository.delete(id)
  }
}
