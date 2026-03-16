import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import type { RolesType } from 'src/users/schemas/user.schema';

export type JwtUser = { userId: string; email: string; role: RolesType };

export interface RequestWithUser extends Request {
  user: JwtUser;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtUser => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    return req.user;
  },
);
