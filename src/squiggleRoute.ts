import { FastifyInstance, FastifyRequest } from 'fastify'
import p5 from 'node-p5'
import { sketch } from './simple'

interface SquiggleRoute {
  hash: string
}

export const squiggleRoutes = async (fastify: FastifyInstance, options) => {
  fastify.get<{
    Params: SquiggleRoute
  }>('/:hash', async (request, reply) => {
    const imageData: string = await new Promise((resolve, reject) => {
      p5.createSketch(p => sketch(p, resolve))
      // p5.createSketch(p => sketch(p, resolve, request.params.hash))
    })

    const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64')

    reply.code(200).header('Content-Type', 'image/png').send(imageBuffer)
  })
}
