import { RequestHandler, Router } from "express";
import morgan from "morgan";

import { handleErrors } from "../middlewares/handleErrors";
import { jsonify } from "../middlewares/jsonify";

import { authorize } from "./authorize";
import { token } from "./token";

const oauth2Router = Router();
oauth2Router.get("/authorize", morgan("dev") as RequestHandler, jsonify, handleErrors(authorize));
oauth2Router.post("/token", morgan("dev") as RequestHandler, jsonify, handleErrors(token));

export { oauth2Router };
