import { TripRepository } from '@/repositories/interfaces/trips-repository'

export class GetUserTripsUseCase {
  constructor(private tripsRepository: TripRepository) {}

  async execute(userId: string) {
    const trips = await this.tripsRepository.findByUserId(userId)

    return { trips }
  }
}
