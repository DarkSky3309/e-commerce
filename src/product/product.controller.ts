import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ProductService } from './product.service';
import { GetAllProductDto } from './dto/getAllProduct.dto';
import { AuthDecorator } from '../decorators/auth.decorator';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAllProducts(@Query() queryDto: GetAllProductDto) {
    return this.productService.getAllProducts(queryDto);
  }

  @Get('similar/:id')
  async getSimilarProducts(@Param('id') id: string) {
    return this.productService.getSimilarProducts(+id);
  }

  @Get('slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Get('category/:categorySlug')
  async getProductsByCategory(@Param('categorySlug') categorySlug: string) {
    return this.productService.findByCategorySlug(categorySlug);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @AuthDecorator()
  @Post()
  async createProduct() {
    return this.productService.createProduct();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @AuthDecorator()
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.updateProduct(+id, dto);
  }

  @HttpCode(200)
  @AuthDecorator()
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(+id);
  }

  @Get(':id')
  @AuthDecorator()
  async getProductById(@Param('id') id: string) {
    return this.productService.findProductById(+id);
  }
}
