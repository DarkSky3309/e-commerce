import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserSelect } from './userSelect.object';
import { Prisma } from '@prisma/client';
import { UserDto } from './user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(
    id: number,
    selectObject: Prisma.UserSelect = {}
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: { id },
        select: {
          ...UserSelect,
          favorits: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              slug: true,
            },
          },
          ...selectObject,
        },
      });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateProfile(id: number, data: UserDto) {
    const isSameEmail =
      await this.prisma.user.findUnique({
        where: { email: data.email },
      });
    if (isSameEmail && isSameEmail.id !== id) {
      throw new Error('Email already exists');
    }
    const user = await this.getProfile(id);
    return this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        avatarPath: data.avatarPath,
        password: data.password
          ? await hash(data.password)
          : user.password,
      },
    });
  }

  async toggleFavorites(
    userId: number,
    productId: number
  ) {
    const user = await this.getProfile(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const isExist = await user.favorits.some(
      product => product.id === productId
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        favorits: {
          [isExist ? 'disconnect' : 'connect']: {
            id: productId,
          },
        },
      },
    });
    return { message: 'Success' };
  }
}
