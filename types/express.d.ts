declare namespace Express {
  interface Request {
    user?: import('../server/entities/user').User;
    village?: import('./village.type').Village;
    appClient?: import('./client.type').Client;
    getCsrfToken(): string;
    csrfToken: string;
    isCsrfValid: boolean;
  }
  interface Response {
    sendJSON: (object: unknown | unknown[]) => void;
  }
}
