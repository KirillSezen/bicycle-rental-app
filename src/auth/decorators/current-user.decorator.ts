import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../types/auth.types';

interface RequestWithUser extends Request {
  user: AuthUser;
}

export const CurrentUser = createParamDecorator(
  (field: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<RequestWithUser>().user;
    return field ? user[field] : user;
  },
);
