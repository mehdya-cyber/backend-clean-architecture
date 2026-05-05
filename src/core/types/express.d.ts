declare global {
  namespace Express {
    interface Request {
      id?: string;
      log: Logger;
      requestId?: string;
      user?: {
        userId: string;
        role: string;
        email: string;
      };
    }
  }
}

export {};
