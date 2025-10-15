import Fastify from 'fastify'
import { app, options } from './app.js'

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
  bodyLimit: 50 * 1024 * 1024, // 50MB
  requestTimeout: 300000, // 5 minutes for video processing
  keepAliveTimeout: 300000,
})

// Register the app
await server.register(app, options)

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  server.log.info(`Received ${signal}, shutting down gracefully`)
  
  try {
    await server.close()
    server.log.info('Server closed successfully')
    process.exit(0)
  } catch (error) {
    server.log.error({ error }, 'Error during shutdown')
    process.exit(1)
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Start the server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000
    const host = process.env.HOST || '0.0.0.0'
    
    await server.listen({ port, host })
    server.log.info(`Server listening on http://${host}:${port}`)
  } catch (error) {
    server.log.error({ error }, 'Error starting server')
    process.exit(1)
  }
}

start()