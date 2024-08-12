import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { LinksRepository } from '@/repositories/interfaces/links-repository'
import { TripRepository } from '@/repositories/interfaces/trips-repository'

interface DeleteLinkParams {
  userId: string
  linkId: string
}

export class DeleteLinkUseCase {
  constructor(
    private linksRepository: LinksRepository,
    private tripsRepository: TripRepository,
  ) {}

  async execute({ linkId, userId }: DeleteLinkParams) {
    const link = await this.linksRepository.findById(linkId)

    if (!link) {
      throw new NotFoundError('Link')
    }

    const trip = await this.tripsRepository.findById(link.tripId)

    if (trip?.userId !== userId) {
      throw new UnauthorizedError()
    }

    await this.linksRepository.delete(linkId)
  }
}
