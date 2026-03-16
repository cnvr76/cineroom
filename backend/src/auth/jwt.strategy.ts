import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import type { JwtUser } from './decorators/current-user.decorator';
import type { RolesType } from 'src/users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  validate(payload: { sub: string; email: string; role: RolesType }): JwtUser {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
