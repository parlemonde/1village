import { RequestHandler, Router } from "express";
import morgan from "morgan";

import { handleErrors } from "../middlewares/handleErrors";
import { jsonify } from "../middlewares/jsonify";

import { authorize } from "./authorize";
import { token } from "./token";

const oauth2Router = Router();
oauth2Router.use(morgan("dev") as RequestHandler);
oauth2Router.use(jsonify);
oauth2Router.get("/authorize", handleErrors(authorize));
oauth2Router.post("/token", handleErrors(token));

export { oauth2Router };
