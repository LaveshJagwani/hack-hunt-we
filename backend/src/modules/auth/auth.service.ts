import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async loginAdmin(
    dto: AdminLoginDto,
  ): Promise<{ accessToken: string; tokenType: 'Bearer' }> {
    const user = await this.ensureSeedAdmin(dto.email);
    const isValid = await compare(dto.password, user.passwordHash);

    if (!isValid || !user.isActive) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: 'admin',
    };

    await this.prismaService.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      accessToken: await this.jwtService.signAsync(payload),
      tokenType: 'Bearer',
    };
  }

  private async ensureSeedAdmin(email: string) {
    const existing = await this.prismaService.adminUser.findUnique({
      where: { email },
    });

    if (existing) {
      return existing;
    }

    const seedEmail = this.configService.get<string>('auth.adminSeedEmail');
    const seedPassword = this.configService.get<string>(
      'auth.adminSeedPassword',
    );

    if (
      !seedEmail ||
      !seedPassword ||
      email.toLowerCase() !== seedEmail.toLowerCase()
    ) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    return this.prismaService.adminUser.create({
      data: {
        email: seedEmail.toLowerCase(),
        passwordHash: await hash(seedPassword, 12),
      },
    });
  }
}
