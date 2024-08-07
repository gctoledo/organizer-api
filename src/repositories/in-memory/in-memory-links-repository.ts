import { Prisma, Link } from '@prisma/client'
import { LinksRepository } from '../interfaces/links-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryLinksRepository implements LinksRepository {
  private links: Link[] = []

  async findById(id: string) {
    const link = this.links.find((link) => link.id === id)

    if (!link) return null

    return link
  }

  async findByTripId(tripId: string) {
    const links = this.links.filter((link) => link.tripId === tripId)

    return links
  }

  async create(data: Prisma.LinkUncheckedCreateInput) {
    const link = {
      ...data,
      id: randomUUID().toString(),
      created_at: new Date(),
    }

    this.links.push(link)

    return link
  }

  async delete(id: string) {
    this.links = this.links.filter((link) => link.id !== id)
  }
}
