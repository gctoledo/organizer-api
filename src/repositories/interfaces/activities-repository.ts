import { Activity, Prisma } from '@prisma/client'

export interface ActivitiesRepository {
  create(data: Prisma.ActivityUncheckedCreateInput): Promise<Activity>
}
