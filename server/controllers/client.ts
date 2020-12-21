import { JSONSchemaType } from "ajv";
import * as argon2 from "argon2";
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";

import { Client } from "../entities/client";
import { ajv, sendInvalidDataError } from "../utils/jsonSchemaValidator";
import { generateTemporaryPassword, valueOrDefault } from "../utils";

import { Controller } from "./controller";

const clientController = new Controller("/clients");

// --- Get all clients. ---
clientController.get("", async (_req: Request, res: Response) => {
  const clients = await getRepository(Client).find();
  res.sendJSON(clients.map((c) => c.withoutSecret()));
});

// --- Get one client. ---
clientController.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id || "";
  const client = await getRepository(Client).findOne(id);
  if (client === undefined) {
    next();
    return;
  }
  res.sendJSON(client.withoutSecret());
});

// --- Create a client. ---
type CreateClientData = {
  name: string;
  redirectUri: string;
  isConfidential?: boolean;
};
const CREATE_SCHEMA: JSONSchemaType<CreateClientData> = {
  type: "object",
  properties: {
    name: { type: "string" },
    redirectUri: { type: "string", format: "uri" },
    isConfidential: { type: "boolean", nullable: true },
  },
  required: ["name", "redirectUri"],
  additionalProperties: false,
};
const createClientValidator = ajv.compile(CREATE_SCHEMA);
clientController.post("", async (req: Request, res: Response) => {
  const data = req.body;
  if (!createClientValidator(data)) {
    sendInvalidDataError(createClientValidator);
    return;
  }

  const client = new Client();
  client.name = data.name;
  client.redirectUri = data.redirectUri;
  client.isConfidential = valueOrDefault(data.isConfidential, false);
  const clientSecret = generateTemporaryPassword(60);
  client.secret = await argon2.hash(clientSecret);
  await getRepository(Client).save(client);
  res.sendJSON({ ...client, secret: clientSecret });
});

// --- Edit a client. ---
type EditClientData = {
  name?: string;
  redirectUri?: string;
  isConfidential?: boolean;
};
const EDIT_SCHEMA: JSONSchemaType<EditClientData> = {
  type: "object",
  properties: {
    name: { type: "string", nullable: true },
    redirectUri: { type: "string", format: "uri", nullable: true },
    isConfidential: { type: "boolean", nullable: true },
  },
  required: [],
  additionalProperties: false,
};
const editClientValidator = ajv.compile(EDIT_SCHEMA);
clientController.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id || "";
  const client = await getRepository(Client).findOne({ where: { id } });
  if (client === undefined) {
    next();
    return;
  }
  const data = req.body;
  if (!editClientValidator(data)) {
    sendInvalidDataError(editClientValidator);
    return;
  }
  client.name = valueOrDefault(data.name, client.name);
  client.redirectUri = valueOrDefault(data.redirectUri, client.redirectUri);
  client.isConfidential = valueOrDefault(data.isConfidential, false);
  await getRepository(Client).save(client);
  res.sendJSON(client.withoutSecret());
});

// --- Delete a client. ---
clientController.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id || "";
  await getRepository(Client).delete(id);
  res.status(204).send();
});

export { clientController };
