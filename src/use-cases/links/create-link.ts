import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { LinksRepository } from '@/repositories/interfaces/links-repository'
import { TripRepository } from '@/repositories/interfaces/trips-repository'

interface CreateLinkParams {
  tripId: string
  userId: string
  url: string
  title: string
}

export class CreateLinkUseCase {
  constructor(
    private linksRepository: LinksRepository,
    private tripRepository: TripRepository,
  ) {}

  async execute({ title, tripId, url, userId }: CreateLinkParams) {
    const trip = await this.tripRepository.findById(tripId)

    if (!trip) {
      throw new NotFoundError('Trip')
    }

    if (trip.userId !== userId) {
      throw new UnauthorizedError()
    }

    const link = await this.linksRepository.create({ title, tripId, url })

    return { link }
  }
}
