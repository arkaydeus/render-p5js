import { FastifyInstance, FastifyRequest } from 'fastify'
import p5 from 'node-p5'
import { sketch } from './squiggle'

interface SquiggleRoute {
  hash: string
}

export const squiggleRoutes = async (fastify: FastifyInstance, options) => {
  fastify.get<{
    Params: SquiggleRoute
  }>('/:hash', async (request, reply) => {
    if (!request.params.hash) {
      reply.code(400).send('Please provide a token hash')
      return
    }

    if (request.params.hash.length !== 66) {
      reply.code(400).send('Invalid hash')
      return
    }

    const imageData: string = await new Promise(resolve => {
      p5.createSketch(p => sketch(p, resolve, [request.params.hash]))
    })

    const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64')

    reply.code(200).header('Content-Type', 'image/png').send(imageBuffer)
  })
}
