import { Crypto } from '@/helpers/crypto'
import { it, describe, expect, vi, beforeEach } from 'vitest'
import { CreateUserUseCase } from './create-user'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { EmailAlreadyExistsError } from '@/errors/email-already-exists'
import { GenerateData } from '@/tests/generate-data'

describe('CreateUserUseCase', () => {
  let usersRepository: InMemoryUserRepository
  let crypto: Crypto
  let sut: CreateUserUseCase

  beforeEach(() => {
    const data = new GenerateData()
    crypto = new Crypto()
    sut = new CreateUserUseCase(data.usersRepository, crypto)
    usersRepository = data.usersRepository
  })

  it('should be able to hash passoword', async () => {
    const spy = vi.spyOn(crypto, 'hash')

    const { user } = await sut.execute({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const hashedPassword = await compare('password', user.password)

    expect(spy).toHaveBeenCalledWith('password')
    expect(hashedPassword).toBe(true)
  })

  it('should not be able to create user if email already exists', async () => {
    await usersRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const promise = sut.execute({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    expect(promise).rejects.toThrow(EmailAlreadyExistsError)
  })
})
