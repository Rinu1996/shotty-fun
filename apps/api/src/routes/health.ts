import { FastifyPluginAsync } from 'fastify'

const healthRoutes: FastifyPluginAsync = async (fastify, options) => {
  fastify.get('/health', async (request, reply) => {
    try {
      // Check database connection
      await fastify.prisma.$queryRaw`SELECT 1`
      
      // Check Redis connection (if available)
      let redisStatus = 'unknown'
      try {
        if ((fastify as any).redis) {
          await (fastify as any).redis.ping()
          redisStatus = 'connected'
        }
      } catch (error) {
        redisStatus = 'disconnected'
      }

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          redis: redisStatus
        }
      }
    } catch (error) {
      reply.code(503)
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  fastify.get('/ready', async (request, reply) => {
    try {
      // Check if all required services are ready
      await fastify.prisma.$queryRaw`SELECT 1`
      
      return {
        status: 'ready',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      reply.code(503)
      return {
        status: 'not ready',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })
}

export default healthRoutes