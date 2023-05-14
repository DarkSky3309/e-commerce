import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService
  ) {
  }

  async getMainStatistics(userId: number) {
    const user = await this.userService.getProfile(userId, {
      orders: {
        select: {
          items: {
            select: {
              price: true
            }
          }
        }
      },
      reviews: true
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return [
      {
        name: 'Orders',
        value: user.orders.length
      },
      {
        name: 'Reviews',
        value: user.reviews.length
      },
      {
        name: 'Favorite products',
        value: user.favorits.length
      },
      {
        name: 'Total spent',
        value: 1000
      }
    ];
  }
}
