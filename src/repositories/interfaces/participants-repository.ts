import { Participant, Prisma } from '@prisma/client'

export interface ParticipantsRepository {
  findById(id: string): Promise<Participant | null>
  findByTripId(tripId: string): Promise<Participant[]>
  create(data: Prisma.ParticipantUncheckedCreateInput): Promise<Participant>
  createMany(
    data: Prisma.ParticipantUncheckedCreateInput[],
  ): Promise<Participant[]>
  delete(id: string): Promise<void>
  deleteMany(ids: string[]): Promise<void>
  confirm(id: string): Promise<void>
}
