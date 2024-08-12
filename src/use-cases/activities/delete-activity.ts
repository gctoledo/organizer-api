import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { ActivitiesRepository } from '@/repositories/interfaces/activities-repository'
import { TripRepository } from '@/repositories/interfaces/trips-repository'

interface DeleteActivityUseCaseParams {
  userId: string
  activityId: string
}

export class DeleteActivityUseCase {
  constructor(
    private activitiesRepository: ActivitiesRepository,
    private tripsRepository: TripRepository,
  ) {}

  async execute({ activityId, userId }: DeleteActivityUseCaseParams) {
    const activity = await this.activitiesRepository.findById(activityId)

    if (!activity) {
      throw new NotFoundError('Activity')
    }

    const trip = await this.tripsRepository.findById(activity.tripId)

    if (trip?.userId !== userId) {
      throw new UnauthorizedError()
    }

    await this.activitiesRepository.delete(activityId)
  }
}
