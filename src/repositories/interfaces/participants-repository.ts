import { Participant, Prisma } from '@prisma/client'

export interface ParticipantsRepository {
  create(data: Prisma.ParticipantUncheckedCreateInput): Promise<Participant>
  createMany(
    data: Prisma.ParticipantUncheckedCreateInput[],
  ): Promise<Participant[]>
  findByTripId(tripId: string): Promise<Participant[]>
  deleteMany(ids: string[]): Promise<void>
}
