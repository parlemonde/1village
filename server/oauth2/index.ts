import { RequestHandler, Router } from "express";
import morgan from "morgan";

import { authenticate } from "../middlewares/authenticate";
import { handleErrors } from "../middlewares/handleErrors";
import { jsonify } from "../middlewares/jsonify";

import { authorize } from "./authorize";
import { authClient } from "./lib/clientAuth";
import { login } from "./login";
import { logout } from "./logout";
import { token } from "./token";

const oauth2Router = Router();
oauth2Router.get("/authorize", morgan("dev") as RequestHandler, jsonify, handleErrors(authenticate()), handleErrors(authorize));
oauth2Router.post("/token", morgan("dev") as RequestHandler, jsonify, handleErrors(authClient), handleErrors(token));
oauth2Router.post("/login", morgan("dev") as RequestHandler, jsonify, handleErrors(login));
oauth2Router.post("/logout", morgan("dev") as RequestHandler, jsonify, handleErrors(logout));

export { oauth2Router };
