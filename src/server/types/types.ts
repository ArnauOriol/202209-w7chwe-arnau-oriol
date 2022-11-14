import type { JwtPayload } from "jsonwebtoken";

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  picture?: string;
}

export interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
}

export interface Credentials {
  username: string;
  password: string;
}
