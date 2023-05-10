import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserSelect } from './userSelect.object';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getProfile(id: number, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
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
}
