import { Link, Prisma } from '@prisma/client'

export interface LinksRepository {
  create(data: Prisma.LinkUncheckedCreateInput): Promise<Link>
  findById(id: string): Promise<Link | null>
  findByTripId(tripId: string): Promise<Link[]>
  delete(id: string): Promise<void>
}
