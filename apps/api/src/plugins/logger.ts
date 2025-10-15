import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

/**
 * Logger configuration plugin
 */
const loggerPlugin: FastifyPluginAsync = async (fastify, opts) => {
  // Log all requests
  fastify.addHook("onRequest", async (request, reply) => {
    fastify.log.info({
      url: request.url,
      method: request.method,
      ip: request.ip,
      userAgent: request.headers["user-agent"],
    }, "Incoming request");
  });

  // Log response time
  fastify.addHook("onResponse", async (request, reply) => {
    fastify.log.info({
      url: request.url,
      method: request.method,
      statusCode: reply.statusCode,
      responseTime: reply.getResponseTime(),
    }, "Request completed");
  });
};

export default fp(loggerPlugin);
