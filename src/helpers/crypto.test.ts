import { describe, expect, it } from 'vitest'
import { Crypto } from './crypto'

describe('Crypto', async () => {
  const crypto = new Crypto()

  it('should be able to hash password', async () => {
    const password = 'password'

    const hashedPassword = await crypto.hash(password)

    const hashIsValid = await crypto.compare({ hashedPassword, password })

    expect(hashIsValid).toEqual(true)
  })

  it('should return "false" if password match', async () => {
    const password = 'password'

    const hashedPassword = await crypto.hash(password)

    const hashIsValid = await crypto.compare({
      hashedPassword,
      password: 'wrong_password',
    })

    expect(hashIsValid).toEqual(false)
  })
})
