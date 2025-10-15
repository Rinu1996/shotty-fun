import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

const errorHandlerPlugin: FastifyPluginAsync = fp(async (server, options) => {
  server.setErrorHandler(async (error, request, reply) => {
    server.log.error(error, 'Unhandled error occurred')

    // Don't expose internal errors in production
    const isDevelopment = server.env.APP_MODE === 'dev'
    
    const statusCode = error.statusCode || 500
    const message = isDevelopment ? error.message : 'Internal Server Error'
    
    reply.code(statusCode).send({
      error: {
        message,
        statusCode,
        ...(isDevelopment && { stack: error.stack })
      }
    })
  })

  server.setNotFoundHandler(async (request, reply) => {
    reply.code(404).send({
      error: {
        message: 'Route not found',
        statusCode: 404,
        path: request.url
      }
    })
  })
})

export default errorHandlerPlugin