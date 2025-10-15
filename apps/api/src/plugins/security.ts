import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

const securityPlugin: FastifyPluginAsync = fp(async (server, options) => {
  // Add security headers
  server.addHook('onSend', async (request, reply, payload) => {
    // Security headers
    reply.header('X-Content-Type-Options', 'nosniff')
    reply.header('X-Frame-Options', 'DENY')
    reply.header('X-XSS-Protection', '1; mode=block')
    reply.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    reply.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
    
    // Remove server header
    reply.removeHeader('x-powered-by')
    reply.removeHeader('server')
    
    return payload
  })

  // Rate limiting for production
  if (process.env.NODE_ENV === 'production') {
    await server.register(import('@fastify/rate-limit'), {
      max: 100,
      timeWindow: '1 minute',
      errorResponseBuilder: function (request: any, context: any) {
        return {
          code: 429,
          error: 'Too Many Requests',
          message: `Rate limit exceeded, retry in ${context.ttl} milliseconds.`,
          date: Date.now(),
          expiresIn: context.ttl
        }
      }
    })
  }

  // Request size limits
  server.register(import('@fastify/formbody'), {
    bodyLimit: 50 * 1024 * 1024 // 50MB limit for video uploads
  })

  // Helmet for additional security
  await server.register(import('@fastify/helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", "https:"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false
  })
})

export default securityPlugin