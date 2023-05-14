import { Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthDecorator } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/user.decorator';
import { ReviewDto } from './review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly rewievService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll() {
    return this.rewievService.findAll();
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
    return this.rewievService.createReview(id, dto, +productId);
  }
}
