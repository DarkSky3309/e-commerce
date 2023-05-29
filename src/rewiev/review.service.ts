import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { returnReviewObject } from './return-review.object';
import { ReviewDto } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: returnReviewObject,
    });
  }

  async createReview(userId: number, data: ReviewDto, productId: number) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: productId,
      }
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.prismaService.review.create({
      data: {
        ...data,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getAverageRating(productId: number) {
    return this.prismaService.review
      .aggregate({
        where: {
          productId,
        },
        _avg: {
          rating: true,
        },
      })
      .then((data) => data._avg);
  }

  async getReviews(productId: number) {
    return this.prismaService.review.findMany({
      where: {
        productId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: returnReviewObject,
    });
  }
}
