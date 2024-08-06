import { Link, Prisma } from '@prisma/client'

export interface LinksRepository {
  create(data: Prisma.LinkUncheckedCreateInput): Promise<Link>
}
