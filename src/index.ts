import Fastify from 'fastify'
import { squiggleRoutes } from './squiggleRoute'

const fastify = Fastify({
  logger: true
})

fastify.register(squiggleRoutes)

/**
 * Run the server!
 *
 */
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 8080
    await fastify.listen({ port, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
