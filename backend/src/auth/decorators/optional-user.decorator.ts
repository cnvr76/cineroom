import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest<T>(err: unknown, user: T): T {
    return user || (null as T);
  }
}
