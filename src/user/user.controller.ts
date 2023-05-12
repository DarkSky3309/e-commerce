import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
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
  constructor(
    private readonly userService: UserService
  ) {}

  @Get('profile')
  @AuthDecorator()
  async getProfile(
    @CurrentUser('id') id: number
  ) {
    return this.userService.getProfile(id);
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @AuthDecorator()
  async updateProfile(
    @CurrentUser('id') id: number,
    @Body() dto: UserDto
  ) {
    return this.userService.updateProfile(
      id,
      dto
    );
  }

  @HttpCode(200)
  @AuthDecorator()
  @Patch('profile/favorits/:productId')
  async toggleFavorits(
    @Param('productId') ProductId: string,
    @CurrentUser('id') userId: number
  ) {
    return this.userService.toggleFavorits(
      userId,
      +ProductId
    );
  }
}
