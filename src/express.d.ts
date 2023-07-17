import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user: AuthData;
  }
}

interface AuthData {
  email: string;
  _id: string;
}
