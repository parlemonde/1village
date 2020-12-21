import { JSONSchemaType } from "ajv";
import * as argon2 from "argon2";
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";

import { User, UserType } from "../entities/user";
import { AppError, ErrorCode } from "../middlewares/handleErrors";
import { ajv, sendInvalidDataError } from "../utils/jsonSchemaValidator";
import { generateTemporaryPassword, valueOrDefault, isPasswordValid } from "../utils";

import { Controller } from "./controller";

const userController = new Controller("/users");
// --- Get all users. ---
userController.get("", async (_req: Request, res: Response) => {
  const users = await getRepository(User).find();
  res.sendJSON(users.map((u) => u.withoutPassword()));
});

// --- Get one user. ---
userController.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const user = await getRepository(User).findOne({ where: { id } });
  if (user === undefined) {
    next();
    return;
  }
  res.sendJSON(user.withoutPassword());
});

// --- Create an user. ---
type CreateUserData = {
  email: string;
  pseudo: string;
  level?: string;
  school?: string;
  password?: string;
  type?: UserType;
};
const CREATE_SCHEMA: JSONSchemaType<CreateUserData> = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    pseudo: { type: "string" },
    level: { type: "string", nullable: true },
    school: { type: "string", nullable: true },
    password: { type: "string", nullable: true },
    type: { type: "number", nullable: true, enum: [0, 1, 2] },
  },
  required: ["email", "pseudo"],
  additionalProperties: false,
};
const createUserValidator = ajv.compile(CREATE_SCHEMA);
userController.post("", async (req: Request, res: Response) => {
  const data = req.body;
  if (!createUserValidator(data)) {
    sendInvalidDataError(createUserValidator);
    return;
  }
  if (data.password !== undefined && !isPasswordValid(data.password)) {
    throw new AppError("Invalid password", ErrorCode.INVALID_PASSWORD);
  }

  const user = new User();
  user.email = data.email;
  user.pseudo = data.pseudo;
  user.level = data.level || "";
  user.school = data.school || "";
  user.type = valueOrDefault(data.type, UserType.CLASS);
  user.accountRegistration = data.password === undefined ? 3 : 0;
  user.passwordHash = data.password ? await argon2.hash(data.password) : "";
  const temporaryPassword = generateTemporaryPassword(20);
  user.verificationHash = await argon2.hash(temporaryPassword);
  // todo: send mail with verification password to validate the email adress.

  await getRepository(User).save(user);
  res.sendJSON(user.withoutPassword());
});

// --- Edit an user. ---
type EditUserData = {
  email?: string;
  pseudo?: string;
  level?: string;
  school?: string;
  type?: UserType;
};
const EDIT_SCHEMA: JSONSchemaType<EditUserData> = {
  type: "object",
  properties: {
    email: { type: "string", format: "email", nullable: true },
    pseudo: { type: "string", nullable: true },
    level: { type: "string", nullable: true },
    school: { type: "string", nullable: true },
    type: { type: "number", nullable: true, enum: [0, 1, 2] },
  },
  required: [],
  additionalProperties: false,
};
const editUserValidator = ajv.compile(EDIT_SCHEMA);
userController.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const user = await getRepository(User).findOne({ where: { id } });
  if (user === undefined) {
    next();
    return;
  }
  const data = req.body;
  if (!editUserValidator(data)) {
    sendInvalidDataError(editUserValidator);
    return;
  }

  user.email = valueOrDefault(data.email, user.email);
  user.pseudo = valueOrDefault(data.pseudo, user.pseudo);
  user.level = valueOrDefault(data.level, user.level);
  user.school = valueOrDefault(data.school, user.school);
  user.type = valueOrDefault(data.type, user.type);
  await getRepository(User).save(user);
  res.sendJSON(user.withoutPassword());
});

// --- Delete an user. ---
userController.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10) || 0;
  await getRepository(User).delete({ id });
  res.status(204).send();
});

export { userController };
