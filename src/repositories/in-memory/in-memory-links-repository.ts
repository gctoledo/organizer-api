import { Prisma, Link } from '@prisma/client'
import { LinksRepository } from '../interfaces/links-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryLinksRepository implements LinksRepository {
  private links: Link[] = []

  async create(data: Prisma.LinkUncheckedCreateInput) {
    const link = {
      ...data,
      id: randomUUID().toString(),
    }

    this.links.push(link)

    return link
  }
}
