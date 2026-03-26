import path from "node:path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { toNodeHandler } from "better-auth/node";
import routes from "./routes/index.js";
import { auth } from "./lib/auth.js";
import { openApiDocument } from "./docs/openapi.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
  process.env.BILHETERIA_URL,
  process.env.LOJA_URL,
  process.env.ADMIN_URL,
  ...(process.env.TRUSTED_ORIGINS?.split(",") ?? []),
]
  .map((item) => item?.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin não permitida pelo CORS."));
    },
    credentials: true,
  }),
);

app.use(helmet());
app.use(cookieParser());

app.use((req, _res, next) => {
  req.rawBody = "";
  next();
});

app.all("/api/auth/*", toNodeHandler(auth));

app.use(
  express.json({
    verify(req, _res, buf) {
      (req as import("express").Request).rawBody = buf.toString("utf8");
    },
  }),
);

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    explorer: true,
    customSiteTitle: "Coração Gaúcho API Docs",
  }),
);

app.get("/", (_req, res) => {
  return res.status(200).send("API Coração Gaúcho online");
});

app.get("/health", (_req, res) => {
  return res.json({ success: true, message: "API online" });
});

app.get("/docs.json", (_req, res) => {
  return res.json(openApiDocument);
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;