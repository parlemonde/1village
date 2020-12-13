import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export function getAccessToken(
  userId: number,
  withRefreshToken: boolean = false,
): {
  accessToken: string;
  refreshToken: string;
} {
  const secret: string = process.env.APP_SECRET || "";

  const accessToken = jwt.sign({ userId }, secret, { expiresIn: "1h" });
  let refreshToken = "";
  if (withRefreshToken) {
    refreshToken = uuidv4();
  }

  return {
    accessToken,
    refreshToken,
  };
}
