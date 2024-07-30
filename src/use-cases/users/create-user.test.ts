import { Crypto } from '@/helpers/crypto'
import { it, describe, expect, vi } from 'vitest'
import { CreateUserUseCase } from './create-user'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'

describe('CreateUserUseCase', () => {
  const makeSut = () => {
    const crypto = new Crypto()

    const userRepository = new InMemoryUserRepository()

    const sut = new CreateUserUseCase(crypto, userRepository)

    return { crypto, userRepository, sut }
  }

  it('should be able to hash passoword', async () => {
    const { sut, crypto } = makeSut()

    const spy = vi.spyOn(crypto, 'hash')

    const result = await sut.execute({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const hashedPassword = await compare('password', result.password)

    expect(spy).toHaveBeenCalledWith('password')
    expect(hashedPassword).toBe(true)
  })
})
