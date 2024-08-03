import { Participant, Prisma, Trip } from '@prisma/client'

export interface ParticipantParams {
  first_name?: string
  email: string
  owner: boolean
}

export interface CreateTripParams {
  data: Prisma.TripUncheckedCreateInput
  participants: ParticipantParams[]
}

export interface CreateTripResponse {
  trip: Trip
  participants: Participant[]
}

export interface UpdateTripParams {
  id: string
  params: Prisma.TripUpdateInput
}

export interface TripRepository {
  findById(id: string): Promise<Trip | null>
  confirm(id: string): Promise<void>
  create(data: CreateTripParams): Promise<CreateTripResponse>
  delete(id: string): Promise<void>
  update(data: UpdateTripParams): Promise<Trip>
}
