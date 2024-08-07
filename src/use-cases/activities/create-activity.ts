import dayjs from 'dayjs'
import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { ActivitiesRepository } from '@/repositories/interfaces/activities-repository'
import { TripRepository } from '@/repositories/interfaces/trips-repository'
import { InvalidDateError } from '@/errors/invalid-date'

interface CreateActivityParams {
  userId: string
  tripId: string
  title: string
  occurs_at: Date
}

export class CreateActivityUseCase {
  constructor(
    private activityRepository: ActivitiesRepository,
    private tripsRepository: TripRepository,
  ) {}

  async execute({ occurs_at, title, tripId, userId }: CreateActivityParams) {
    const trip = await this.tripsRepository.findById(tripId)

    if (!trip) {
      throw new NotFoundError('Trip')
    }

    if (trip.userId !== userId) {
      throw new UnauthorizedError()
    }

    const isAvailableDate =
      dayjs(occurs_at).isAfter(dayjs(trip.starts_at)) &&
      dayjs(occurs_at).isBefore(dayjs(trip.ends_at))

    if (!isAvailableDate) {
      throw new InvalidDateError()
    }

    const activity = await this.activityRepository.create({
      occurs_at,
      title,
      tripId,
    })

    return { activity }
  }
}
