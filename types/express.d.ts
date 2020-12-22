declare namespace Express {
  interface Request {
    appClient?: import("./client.type").Client;
  }
  interface Response {
    sendJSON: (object: unknown | unknown[]) => void;
  }
}
