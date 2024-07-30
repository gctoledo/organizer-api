import { FastifyInstance } from 'fastify'

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/', async () => {
    return { hello: 'world' }
  })
}
