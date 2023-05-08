import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthDto } from './auth.dto';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: AuthDto) {
    const oldUser = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (oldUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        name: faker.name.firstName(),
        avatarPath: faker.image.avatar(),
        phone: faker.phone.number('+380(##)###-##-##'),
        password: await hash(dto.password),
      },
    });
    const tokens = await this.generateToken(user.id);
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  private async generateToken(userId: number) {
    const data = { id: userId };
    const accessToken = this.jwtService.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }
  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
