import * as path from "path";
import * as fs from "fs";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import { fileURLToPath } from "url";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";

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
  // Place here your custom code!
  // increase the body limit to 50MB
  void fastify.register(fastifyCors);

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: opts,
    forceESM: true,
  });

  // Serve built UI from `../../ui/dist` in dev or `/app/public` in container
  const uiCandidates = [
    path.join(__dirname, "..", "..", "ui", "dist"),
    path.join(__dirname, "public"),
  ];
  const uiRoot = uiCandidates.find((p) => fs.existsSync(p));
  if (uiRoot) {
    fastify.register(fastifyStatic, {
      root: uiRoot,
      prefix: "/",
      preCompressed: true,
      index: ["index.html"],
    });
  }

  // Explicitly mount API routes under /api/v1 to avoid clashing with static
  const { default: generate } = await import(
    "./routes/api/v1/generate/index.js"
  );
  const { default: fileRoute } = await import(
    "./routes/api/v1/file/index.js"
  );
  void fastify.register(generate, { prefix: "/api/v1/generate" });
  void fastify.register(fileRoute, { prefix: "/api/v1/file" });


};

export default app;
export { app, options };
