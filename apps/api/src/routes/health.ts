import { FastifyPluginAsync } from "fastify";

const health: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  // Basic health check
  fastify.get("/health", async (request, reply) => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
    };
  });

  // Detailed health check with dependencies
  fastify.get("/health/detailed", async (request, reply) => {
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      dependencies: {
        redis: "unknown",
        database: "unknown",
        whisper: "unknown",
      },
    };

    try {
      // Check Redis connection
      if ((fastify as any).redis) {
        await (fastify as any).redis.ping();
        health.dependencies.redis = "connected";
      } else {
        health.dependencies.redis = "not configured";
      }
    } catch (error) {
      health.dependencies.redis = "disconnected";
      health.status = "degraded";
    }

    try {
      // Check database connection
      if (fastify.prisma) {
        await fastify.prisma.$queryRaw`SELECT 1`;
        health.dependencies.database = "connected";
      }
    } catch (error) {
      health.dependencies.database = "disconnected";
      health.status = "degraded";
    }

    try {
      // Check Whisper service
      const whisperUrl = process.env.WHISPER_URL || "http://whisper/v1/audio/transcriptions";
      const response = await fetch(whisperUrl, { method: "HEAD" });
      if (response.ok) {
        health.dependencies.whisper = "connected";
      } else {
        health.dependencies.whisper = "disconnected";
        health.status = "degraded";
      }
    } catch (error) {
      health.dependencies.whisper = "disconnected";
      health.status = "degraded";
    }

    const statusCode = health.status === "ok" ? 200 : 503;
    return reply.status(statusCode).send(health);
  });
};

export default health;