import { Role } from 'src/generated/prisma/enums';

export interface RefreshToken {
  userId: string;
  refreshToken: string;
  jti: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  username: string;
  role: Role;
}

export interface RequestWithUser extends Request {
  user: AuthUser;
}
