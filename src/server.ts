import fastify from 'fastify'
import env from './env'

const app = fastify()

app.get('/', async () => {
  return { hello: 'world' }
})

app.listen({ port: env.PORT }).then(() => {
  console.log(`✔ Server running on port ${env.PORT}`)
})
