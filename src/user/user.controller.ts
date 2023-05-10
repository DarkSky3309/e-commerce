import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthDecorator } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/user.decorator';
import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @AuthDecorator()
  async getProfile(@CurrentUser('id') userId: number) {
    return this.userService.getProfile(userId);
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @AuthDecorator()
  async updateProfile(@CurrentUser('id') id: number, @Body() dto: UserDto) {
    return this.userService.updateProfile(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @AuthDecorator()
  @Patch('profile/favorits/:productId')
  async toggleFavorits(
    @Param('productId') ProductId: string,
    @CurrentUser('id') userId: number
  ) {
    return this.userService.toggleFavorits(userId, ProductId);
  }
}
