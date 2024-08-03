import { InvalidDateError } from '@/errors/invalid-date'
import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { TripRepository } from '@/repositories/interfaces/trips-repository'
import { UserRepository } from '@/repositories/interfaces/users-repository'
import dayjs from 'dayjs'

interface UpdateTripUseCaseParams {
  tripId: string
  ownerId: string
  destination?: string
  starts_at?: Date
  ends_at?: Date
}

export class UpdateTripUseCase {
  constructor(
    private tripRepository: TripRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    tripId,
    ownerId,
    destination,
    ends_at,
    starts_at,
  }: UpdateTripUseCaseParams) {
    const trip = await this.tripRepository.findById(tripId)

    if (!trip) {
      throw new NotFoundError('Trip')
    }

    const owner = await this.userRepository.findById(ownerId)

    if (!owner || trip.userId !== owner.id) {
      throw new UnauthorizedError()
    }

    const params = {
      destination: destination ?? trip.destination,
      starts_at: starts_at ?? trip.starts_at,
      ends_at: ends_at ?? trip.ends_at,
    }

    const isAvailableDates =
      dayjs(params.starts_at).isBefore(dayjs(params.ends_at)) &&
      dayjs(new Date()).isBefore(dayjs(params.starts_at))

    if (!isAvailableDates) {
      throw new InvalidDateError()
    }

    const updatedTrip = await this.tripRepository.update({
      id: tripId,
      params,
    })

    return updatedTrip
  }
}
