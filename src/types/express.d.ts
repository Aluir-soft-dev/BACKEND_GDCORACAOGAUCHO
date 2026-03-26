import type { UserRole } from "./auth.js";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        role: UserRole;
        email: string;
        user: {
          id: string;
          name: string;
          email: string;
          role: UserRole;
          isActive: boolean;
        };
        session: unknown;
      };
      rawBody?: string;
    }
  }
}

export {};
