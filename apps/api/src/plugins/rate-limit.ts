import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

/**
 * Simple in-memory rate limiting plugin
 * For production, consider using @fastify/rate-limit with Redis
 */
const rateLimitPlugin: FastifyPluginAsync = async (fastify, opts) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  // Clean up old entries every minute
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of requests.entries()) {
      if (now > value.resetTime) {
        requests.delete(key);
      }
    }
  }, 60000);

  fastify.addHook("onRequest", async (request, reply) => {
    // Skip rate limiting for health check
    if (request.url === "/health") {
      return;
    }

    const ip = request.ip;
    const now = Date.now();
    const windowMs = 60000; // 1 minute window
    const maxRequests = 100; // 100 requests per minute

    let record = requests.get(ip);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      requests.set(ip, record);
    } else {
      record.count++;

      if (record.count > maxRequests) {
        reply.status(429).send({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        });
        return;
      }
    }

    // Add rate limit headers
    reply.header("X-RateLimit-Limit", maxRequests.toString());
    reply.header("X-RateLimit-Remaining", (maxRequests - record.count).toString());
    reply.header(
      "X-RateLimit-Reset",
      new Date(record.resetTime).toISOString()
    );
  });
};

export default fp(rateLimitPlugin);
