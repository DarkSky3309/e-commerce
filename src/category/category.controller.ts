import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthDecorator } from '../decorators/auth.decorator';
import { CategoryDto } from './category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @AuthDecorator()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.categoryService.findById(+id);
  }

  @UsePipes(new ValidationPipe())
  @AuthDecorator()
  @HttpCode(200)
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: CategoryDto,
  ) {
    return this.categoryService.updateCategory(+id, dto);
  }

  @AuthDecorator()
  @HttpCode(200)
  @Post()
  async createCategory() {
    return this.categoryService.createCategory();
  }

  @HttpCode(200)
  @AuthDecorator()
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(+id);
  }
}
