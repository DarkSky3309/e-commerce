import { Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthDecorator } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/user.decorator';
import { ReviewDto } from './review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll() {
    return this.reviewService.findAll();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('create/:productId')
  @AuthDecorator()
  async create(
    @CurrentUser('id') id: number,
    @Body() dto: ReviewDto,
    @Param('productId') productId: string,
  ) {
    return this.reviewService.createReview(id, dto, +productId);
  }

  @Get('average/:productId')
  async getAverageRating(@Param('productId') productId: string) {
    return this.reviewService.getAverageRating(+productId);
  }

  @Get('/:productId')
  async getReviews(@Param('productId') productId: string) {
    return this.reviewService.getReviews(+productId);
  }
}
