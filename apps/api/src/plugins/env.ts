import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    env: {
      FIREWORKS_API_KEY: string
      OPENAI_API_KEY: string
      ELEVEN_LABS_API: string
      PEXELS_API: string
      REDIS_HOST: string
      REDIS_PORT: string
      REDIS_PASSWORD: string
      DATABASE_URL: string
      WHISPER_URL: string
      MODEL_ID: string
      USE_TTS: string
      TTS_URL: string
      OPENAI_BASE_PATH: string
      QUEUE_NAME: string
      APP_MODE: string
      RETURN_TIMESTAMPS: string
    }
  }
}

const envPlugin: FastifyPluginAsync = fp(async (server, options) => {
  const requiredEnvVars = [
    'FIREWORKS_API_KEY',
    'OPENAI_API_KEY',
    'ELEVEN_LABS_API',
    'PEXELS_API',
    'DATABASE_URL',
    'WHISPER_URL',
    'MODEL_ID'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    server.log.error(`Missing required environment variables: ${missingVars.join(', ')}`)
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }

  const env = {
    FIREWORKS_API_KEY: process.env.FIREWORKS_API_KEY!,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    ELEVEN_LABS_API: process.env.ELEVEN_LABS_API!,
    PEXELS_API: process.env.PEXELS_API!,
    REDIS_HOST: process.env.REDIS_HOST || 'cache',
    REDIS_PORT: process.env.REDIS_PORT || '6379',
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
    DATABASE_URL: process.env.DATABASE_URL!,
    WHISPER_URL: process.env.WHISPER_URL!,
    MODEL_ID: process.env.MODEL_ID!,
    USE_TTS: process.env.USE_TTS || 'false',
    TTS_URL: process.env.TTS_URL || '',
    OPENAI_BASE_PATH: process.env.OPENAI_BASE_PATH || 'https://openrouter.ai/api/v1',
    QUEUE_NAME: process.env.QUEUE_NAME || 'shooty-dev',
    APP_MODE: process.env.APP_MODE || 'production',
    RETURN_TIMESTAMPS: process.env.RETURN_TIMESTAMPS || 'word'
  }

  server.decorate('env', env)
  server.log.info('Environment variables validated successfully')
})

export default envPlugin