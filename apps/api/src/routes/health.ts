import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

async function healthRoutes(fastify: FastifyInstance) {
  // Basic health check
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Check database connection
      await fastify.prisma.$queryRaw`SELECT 1`
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      }
    } catch (error) {
      reply.status(503)
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed'
      }
    }
  })

  // Detailed health check
  fastify.get('/health/detailed', async (request: FastifyRequest, reply: FastifyReply) => {
    const checks = {
      database: false,
      redis: false,
      whisper: false
    }

    try {
      // Database check
      await fastify.prisma.$queryRaw`SELECT 1`
      checks.database = true
    } catch (error) {
      // Database is down
    }

    // Redis check (if available)
    try {
      if ((fastify as any).redis) {
        await (fastify as any).redis.ping()
        checks.redis = true
      }
    } catch (error) {
      // Redis is down
    }

    // Whisper service check
    try {
      const whisperUrl = process.env.WHISPER_URL
      if (whisperUrl) {
        const response = await fetch(whisperUrl.replace('/v1/audio/transcriptions', '/health'))
        checks.whisper = response.ok
      }
    } catch (error) {
      // Whisper is down
    }

    const allHealthy = Object.values(checks).every(check => check)
    
    if (!allHealthy) {
      reply.status(503)
    }

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    }
  })

  // Readiness probe
  fastify.get('/ready', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await fastify.prisma.$queryRaw`SELECT 1`
      return { status: 'ready' }
    } catch (error) {
      reply.status(503)
      return { status: 'not ready', error: 'Database not available' }
    }
  })

  // Liveness probe
  fastify.get('/live', async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: 'alive', timestamp: new Date().toISOString() }
  })
}

export default healthRoutes