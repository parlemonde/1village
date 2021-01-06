import { RequestHandler, Router } from "express";
import morgan from "morgan";

import { handleErrors } from "../middlewares/handleErrors";
import { jsonify } from "../middlewares/jsonify";

import { login } from "./login";
import { logout } from "./logout";
import { refreshToken } from "./refreshToken";

const authRouter = Router();
authRouter.post("/token", morgan("dev") as RequestHandler, jsonify, handleErrors(refreshToken));
authRouter.post("/login", morgan("dev") as RequestHandler, jsonify, handleErrors(login));
authRouter.post("/logout", morgan("dev") as RequestHandler, jsonify, handleErrors(logout));

export { authRouter };
