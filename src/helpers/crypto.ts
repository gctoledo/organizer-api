import { hash } from 'bcryptjs'

export interface ICrypto {
  hash(password: string): Promise<string>
}

export class Crypto implements ICrypto {
  async hash(password: string): Promise<string> {
    const hashedPassword = await hash(password, 8)

    return hashedPassword
  }
}
