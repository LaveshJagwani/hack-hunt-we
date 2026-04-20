import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login as admin and receive a JWT token' })
  @ApiOkResponse({
    schema: {
      example: {
        tokenType: 'Bearer',
        accessToken: '<jwt-token>',
      },
    },
  })
  @ApiBearerAuth()
  async login(@Body() dto: AdminLoginDto) {
    return this.authService.loginAdmin(dto);
  }
}
