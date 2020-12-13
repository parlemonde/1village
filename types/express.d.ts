declare namespace Express {
  interface Response {
    sendJSON: (object: unknown | unknown[]) => void;
  }
}
