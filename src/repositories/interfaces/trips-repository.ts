import { Prisma, Trip } from '@prisma/client'

export type TripResponse = Prisma.TripGetPayload<{
  include: {
    Participant: true
  }
}>
export type TripDetailsResponse = Prisma.TripGetPayload<{
  include: {
    Participant: true
    Activity: true
    Link: true
  }
}>

export interface ParticipantParams {
  first_name?: string
  email: string
  owner: boolean
}

export interface CreateTripParams {
  data: Prisma.TripUncheckedCreateInput
  participants: ParticipantParams[]
}

export interface UpdateTripParams {
  id: string
  params: Prisma.TripUpdateInput
}

export interface TripRepository {
  findById(id: string): Promise<TripDetailsResponse | null>
  findByUserId(userId: string): Promise<Trip[]>
  confirm(id: string): Promise<void>
  create(data: CreateTripParams): Promise<TripResponse>
  delete(id: string): Promise<void>
  update(data: UpdateTripParams): Promise<Trip>
}
