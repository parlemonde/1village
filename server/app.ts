import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express, { Router, Response, RequestHandler } from "express";
import helmet from "helmet";
import morgan from "morgan";
import next from "next";
import path from "path";
import { Connection } from "typeorm";

import { authRouter } from "./authentication";
import { controllerRouter } from "./controllers";
import { UserType } from "./entities/user";
import { authenticate } from "./middlewares/authenticate";
import { crsfProtection } from "./middlewares/csrfCheck";
import { handleErrors } from "./middlewares/handleErrors";
import { jsonify } from "./middlewares/jsonify";
import { removeTrailingSlash } from "./middlewares/trailingSlash";
import { connectToDatabase } from "./utils/database";
import { logger } from "./utils/logger";
import { onError, normalizePort, getDefaultDirectives } from "./utils/server";

// --- Load environment variables ---
config();
const isDevENV = process.env.NODE_ENV !== "production";
const frontendHandler = next({ dev: isDevENV });
const handle = frontendHandler.getRequestHandler();

async function start() {
  // Connect to DB
  const connection: Connection | null = await connectToDatabase();
  if (connection === null) {
    throw new Error("Could not connect to database...");
  }
  logger.info(`Database connection established: ${connection.isConnected}`);

  // Prepare frontend routes
  await frontendHandler.prepare();

  // [1] --- Init express ---
  const app = express();
  app.enable("strict routing");

  // [2] --- Add the middlewares ---
  const directives = getDefaultDirectives();
  if (isDevENV) {
    directives["default-src"] = ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https:"];
    directives["script-src"] = ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https:"];
  }
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives,
      },
    }),
  );
  app.use(cors() as RequestHandler);
  app.use(removeTrailingSlash);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(crsfProtection());

  // [3] --- Add authentication router ---
  app.use("/", authRouter);

  // [4] --- Add backend API ---
  const backRouter = Router();
  backRouter.use(morgan("dev") as RequestHandler);
  backRouter.use(jsonify);
  backRouter.get("/", (_, res: Response) => {
    res.status(200).send("Hello World 1Village!");
  });
  backRouter.use(controllerRouter);
  backRouter.use((_, res: Response) => {
    res.status(404).send("Error 404 - Not found.");
  });
  app.use("/api", backRouter);

  // [5] --- Add frontend ---
  app.get("/country-flags/*", handleErrors(authenticate(UserType.TEACHER)), express.static(path.join(__dirname, "../../public/country-flags")));
  app.use(express.static(path.join(__dirname, "../../public"))); // app.js is located at ./dist/server and public at ./public
  app.get("/_next/*", (req, res) => {
    handle(req, res).catch((e) => console.error(e));
  });
  app.get(
    "*",
    morgan("dev"),
    handleErrors(authenticate()),
    handleErrors((req, res) => {
      if (req.user === undefined && req.path !== "/login" && req.path !== "/") {
        res.redirect("/login");
        return;
      }
      if (req.path.slice(1, 6) === "admin" && (!req.user || req.user.type < UserType.ADMIN)) {
        res.redirect("/");
        return;
      }
      req.csrfToken = req.getCsrfToken();
      handle(req, res).catch((e) => console.error(e));
    }),
  );

  // [6] --- Last fallback ---
  app.use(morgan("dev") as RequestHandler, (_, res: Response) => {
    res.status(404).send("Error 404 - Not found.");
  });

  // [7] --- Start server ---
  const port = normalizePort(process.env.PORT || "5000");
  const server = app.listen(port);
  server.on("error", onError);
  server.on("listening", () => {
    logger.info(`App listening on port ${port}!`);
  });
}

start().catch((e: Error) => {
  console.error(e);
  process.exit(0);
});
