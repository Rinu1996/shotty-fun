import fp from "fastify-plugin";
import { FastifyPluginAsync, FastifyError } from "fastify";

/**
 * Error handling plugin
 */
const errorHandlerPlugin: FastifyPluginAsync = async (fastify, opts) => {
  fastify.setErrorHandler(function (error: FastifyError, request, reply) {
    const statusCode = error.statusCode || 500;

    // Log error details
    this.log.error({
      error: {
        message: error.message,
        stack: error.stack,
        statusCode,
        url: request.url,
        method: request.method,
      },
    });

    // Don't expose internal error details in production
    const isProduction = process.env.NODE_ENV === "production";
    const errorResponse = {
      error: true,
      statusCode,
      message: isProduction && statusCode === 500 
        ? "Internal Server Error" 
        : error.message,
      ...(isProduction ? {} : { stack: error.stack }),
    };

    reply.status(statusCode).send(errorResponse);
  });

  // Handle 404 errors
  fastify.setNotFoundHandler(function (request, reply) {
    reply.status(404).send({
      error: true,
      statusCode: 404,
      message: "Route not found",
      path: request.url,
    });
  });
};

export default fp(errorHandlerPlugin);
