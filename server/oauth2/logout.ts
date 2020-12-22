import { Request, Response } from "express";

import { revokeRefreshToken } from "./lib/tokens";

export async function logout(req: Request, res: Response): Promise<void> {
  if (req.cookies && req.cookies["refresh-token"]) {
    await revokeRefreshToken(req.cookies["refresh-token"]);
  }

  // send empty expired cookies to delete them
  res.cookie("access-token", "", { maxAge: 0, expires: new Date(0), httpOnly: true });
  res.cookie("refresh-token", "", { maxAge: 0, expires: new Date(0), httpOnly: true });
  res.status(204).send();
}
