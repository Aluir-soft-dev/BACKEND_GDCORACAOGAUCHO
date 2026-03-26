declare module "swagger-ui-express" {
  import type { RequestHandler } from "express";
  export const serve: RequestHandler[];
  export function setup(swaggerDoc: unknown, options?: Record<string, unknown>): RequestHandler;
  const swaggerUi: {
    serve: typeof serve;
    setup: typeof setup;
  };
  export default swaggerUi;
}
