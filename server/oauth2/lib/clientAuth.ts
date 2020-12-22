import * as argon2 from "argon2";
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";

import { Client } from "../../entities/client";
import { getHeader, decodeBase64 } from "../../utils";

export async function authClient(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const clientBearerToken = getHeader(req, "x-access-token") || getHeader(req, "authorization") || null;

  let clientId: string = "";
  let clientSecret: string = "";
  if (clientBearerToken !== null && (clientBearerToken.startsWith("Basic ") || clientBearerToken.startsWith("basic "))) {
    const decoded = decodeBase64(clientBearerToken.slice(6));
    clientId = decoded.split(":")[0];
    clientSecret = decoded.split(":")[1] || "";
  } else {
    clientId = req.body.client_id || "";
    clientSecret = req.body.client_id || "";
  }

  const client = await getRepository(Client).findOne({
    where: { id: clientId },
  });
  if (client !== undefined && (await argon2.verify(client.secret || "", clientSecret))) {
    req.appClient = client;
  }
  next();
}
