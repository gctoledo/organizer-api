import { Participant, Prisma, Trip } from '@prisma/client'

export interface ParticipantParams {
  first_name?: string
  email: string
}

export interface CreateTripParams {
  data: Prisma.TripUncheckedCreateInput
  participants: ParticipantParams[]
}

export interface CreateTripResponse {
  trip: Trip
  participants: Participant[]
}

export interface TripRepository {
  findById(id: string): Promise<Trip | null>
  create(data: CreateTripParams): Promise<CreateTripResponse>
  delete(id: string): Promise<void>
}
