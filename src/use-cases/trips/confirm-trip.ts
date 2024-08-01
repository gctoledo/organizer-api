import { TripRepository } from '@/repositories/interfaces/trips-repository'

export class ConfirmTripUseCase {
  constructor(private tripRepository: TripRepository) {}

  async execute(tripId: string) {
    await this.tripRepository.confirm(tripId)
  }
}
