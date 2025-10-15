import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'

/**
 * Enhanced logging configuration
 */
export default fp(async (fastify: FastifyInstance) => {
  // Configure logger based on environment
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.APP_MODE === 'dev'
  
  fastify.log.level = isDevelopment ? 'debug' : 'info'
  
  // Add request logging
  fastify.addHook('onRequest', async (request, reply) => {
    fastify.log.info({
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    }, 'Incoming request')
  })
  
  // Add response logging
  fastify.addHook('onResponse', async (request, reply) => {
    fastify.log.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      responseTime: reply.getResponseTime(),
    }, 'Request completed')
  })
  
  // Add error logging
  fastify.addHook('onError', async (request, reply, error) => {
    fastify.log.error({
      method: request.method,
      url: request.url,
      error: error.message,
      stack: error.stack,
    }, 'Request error')
  })
})