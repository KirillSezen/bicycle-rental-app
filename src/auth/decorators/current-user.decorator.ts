import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthUser, RequestWithUser } from '../types/auth.types';

export const CurrentUser = createParamDecorator(
  (field: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<RequestWithUser>().user;
    return field ? user[field] : user;
  },
);
