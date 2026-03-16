import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginUserDTO, RegisterUserDTO } from 'src/auth/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async register(@Body() body: RegisterUserDTO) {
    return await this.authService.register(body);
  }

  @Post('/login')
  async login(@Body() body: LoginUserDTO) {
    return await this.authService.login(body);
  }
}
