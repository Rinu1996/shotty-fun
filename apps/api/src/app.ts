import * as path from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import { fileURLToPath } from "url";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Register security plugins
  await fastify.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  });

  // Register rate limiting
  await fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
    errorResponseBuilder: function (request: any, context: any) {
      return {
        code: 429,
        error: "Too Many Requests",
        message: `Rate limit exceeded, retry in ${Math.round(context.after / 1000)} seconds`,
        retryAfter: Math.round(context.after / 1000),
      };
    },
  });

  // Configure CORS
  await fastify.register(fastifyCors, {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
      ];
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // In production, you might want to check against a whitelist
      if (process.env.NODE_ENV === "production") {
        return callback(new Error("Not allowed by CORS"), false);
      }
      
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  });

  // Set body size limit
  fastify.addHook("preHandler", async (request, reply) => {
    if (request.method === "POST" && request.url.includes("/generate")) {
      // Allow larger body for video generation
      reply.header("content-length", "50000000");
    }
  });

  // Global error handler
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    
    if (error.validation) {
      return reply.status(400).send({
        error: "Validation Error",
        message: error.message,
        details: error.validation,
      });
    }
    
    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        error: error.name || "Error",
        message: error.message,
      });
    }
    
    return reply.status(500).send({
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "production" 
        ? "Something went wrong" 
        : error.message,
    });
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: opts,
    forceESM: true,
  });
  
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
    preCompressed: true,
  });
  
  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: opts,
    forceESM: true,
  });
};

export default app;
export { app, options };
