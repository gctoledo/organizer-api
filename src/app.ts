import fastify from 'fastify'
import env from './env'
import { userRoutes } from './http/routes/user'

const app = fastify()

app.register(userRoutes)

app.setErrorHandler((error) => {
  if (env.NODE_ENV !== 'production') {
    console.log(error)
  }
})

export default app
