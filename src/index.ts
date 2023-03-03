import Fastify from 'fastify'
import { squiggleRoutes } from './squiggleRoute'
const fastify = Fastify({
  logger: true
})

fastify.register(squiggleRoutes)

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 8080 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
