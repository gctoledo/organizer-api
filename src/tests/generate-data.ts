import { Crypto } from '@/helpers/crypto'
import { InMemoryActivitiesRepository } from '@/repositories/in-memory/in-memory-activities-repository'
import { InMemoryLinksRepository } from '@/repositories/in-memory/in-memory-links-repository'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { Trip, User } from '@prisma/client'

export class GenerateData {
  private users: User[] = []
  private trips: Trip[] = []
  private crypto: Crypto
  public usersRepository: InMemoryUserRepository
  public tripsRepository: InMemoryTripsRepository
  public participantsRepository: InMemoryParticipantsRepository
  public linksRepository: InMemoryLinksRepository
  public activitiesRepository: InMemoryActivitiesRepository

  constructor() {
    this.usersRepository = new InMemoryUserRepository()
    this.participantsRepository = new InMemoryParticipantsRepository()
    this.linksRepository = new InMemoryLinksRepository()
    this.activitiesRepository = new InMemoryActivitiesRepository()
    this.tripsRepository = new InMemoryTripsRepository(
      this.participantsRepository,
      this.linksRepository,
      this.activitiesRepository,
    )
    this.crypto = new Crypto()
  }

  async createUser() {
    const user = await this.usersRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: await this.crypto.hash('password'),
    })

    this.users.push(user)

    return user
  }

  async createTrip() {
    const createdTrip = await this.tripsRepository.create({
      data: {
        destination: 'New York',
        starts_at: new Date('2030-05-15T00:00:00.000Z'),
        ends_at: new Date('2030-06-15T00:00:00.000Z'),
        userId: this.users[0].id,
      },
      participants: [
        { email: 'john@doe.com', owner: true, is_confirmed: true },
        { email: 'albert@doe.com', owner: false },
        { email: 'robert@doe.com', owner: false },
      ],
    })

    this.trips.push(createdTrip)

    return createdTrip
  }

  async createManyTrips() {
    const tripsToCreate = [
      {
        data: {
          destination: 'New York',
          starts_at: new Date('2030-05-15T00:00:00.000Z'),
          ends_at: new Date('2030-06-15T00:00:00.000Z'),
          userId: this.users[0].id,
        },
        participants: [
          { email: 'john@doe.com', owner: true },
          { email: 'albert@doe.com', owner: false },
          { email: 'robert@doe.com', owner: false },
        ],
      },
      {
        data: {
          destination: 'Los Angeles',
          starts_at: new Date('2030-08-15T00:00:00.000Z'),
          ends_at: new Date('2030-09-15T00:00:00.000Z'),
          userId: this.users[0].id,
        },
        participants: [
          { email: 'john@doe.com', owner: false },
          { email: 'roger@doe.com', owner: false },
        ],
      },
    ]

    const trips = await Promise.all(
      tripsToCreate.map(async (trip) => {
        const result = await this.tripsRepository.create({
          data: trip.data,
          participants: trip.participants,
        })

        return result
      }),
    )

    this.trips.push(...trips)

    return trips
  }

  async createLink() {
    const link = await this.linksRepository.create({
      title: 'Airbnb',
      tripId: this.trips[0].id,
      url: 'https://www.airbnb.com.br',
    })

    return link
  }

  async createActivity() {
    const activity = await this.activitiesRepository.create({
      title: 'Shopping',
      occurs_at: new Date('2030-05-16T00:00:00.000Z'),
      tripId: this.trips[0].id,
    })

    return activity
  }
}
