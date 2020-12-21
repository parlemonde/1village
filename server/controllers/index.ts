import { Router } from "express";

// import all controllers
import { clientController } from "./client";

const controllerRouter = Router();
const controllers = [clientController];

for (let i = 0, n = controllers.length; i < n; i++) {
  controllerRouter.use(controllers[i].name, controllers[i].router);
}

export { controllerRouter };
