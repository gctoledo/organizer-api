import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { ActivitiesRepository } from '@/repositories/interfaces/activities-repository'
import { TripRepository } from '@/repositories/interfaces/trips-repository'

interface UpdateActivityUseCaseParams {
  activityId: string
  userId: string
  title?: string
  occurs_at?: Date
}

export class UpdateActivityUseCase {
  constructor(
    private activitiesRepository: ActivitiesRepository,
    private tripsRepository: TripRepository,
  ) {}

  async execute({
    occurs_at,
    title,
    activityId,
    userId,
  }: UpdateActivityUseCaseParams) {
    const activity = await this.activitiesRepository.findById(activityId)

    if (!activity) {
      throw new NotFoundError('Activity')
    }

    const trip = await this.tripsRepository.findById(activity.tripId)

    if (!trip) {
      throw new NotFoundError('Trip')
    }

    if (trip.userId !== userId) {
      throw new UnauthorizedError()
    }

    const updatedActivity = await this.activitiesRepository.update({
      id: activityId,
      data: {
        occurs_at: occurs_at ?? activity.occurs_at,
        title: title ?? activity.title,
      },
    })

    return { updatedActivity }
  }
}
