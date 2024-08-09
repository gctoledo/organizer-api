import { Activity, Prisma } from '@prisma/client'

export interface UpdateActivityParams {
  id: string
  data: {
    title: string
    occurs_at: Date
  }
}

export interface ActivitiesRepository {
  findById(id: string): Promise<Activity | null>
  findByTripId(tripId: string): Promise<Activity[]>
  create(data: Prisma.ActivityUncheckedCreateInput): Promise<Activity>
  update(data: UpdateActivityParams): Promise<Activity>
}
