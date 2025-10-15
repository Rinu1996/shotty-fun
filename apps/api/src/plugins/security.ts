import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

/**
 * This plugin adds security headers to responses
 */
const securityPlugin: FastifyPluginAsync = async (fastify, opts) => {
  fastify.addHook("onSend", async (request, reply, payload) => {
    // Add security headers
    reply.header("X-Content-Type-Options", "nosniff");
    reply.header("X-Frame-Options", "DENY");
    reply.header("X-XSS-Protection", "1; mode=block");
    reply.header("Referrer-Policy", "strict-origin-when-cross-origin");
    reply.header(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );
    
    // Content Security Policy
    reply.header(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    );

    return payload;
  });
};

export default fp(securityPlugin);
