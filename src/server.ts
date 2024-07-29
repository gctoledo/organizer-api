import fastify from "fastify";

const app = fastify();

app.get('/', async (req, reply) => {
  return { hello: 'world' }
})

app.listen({port: 3333}).then(() => {
  console.log('✔ Server running')
})