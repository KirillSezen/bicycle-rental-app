import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: Role;
}

interface RequestWithUser extends Request {
  user: AuthUser;
}

export const CurrentUser = createParamDecorator(
  (field: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<RequestWithUser>().user;
    return field ? user[field] : user;
  },
);
