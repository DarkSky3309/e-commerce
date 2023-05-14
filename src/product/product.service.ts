import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  returnProductObject,
  returnProductWithCateforyAndReviewsObject,
} from './return-product.object';
import { ProductDto } from './dto/product.dto';
import { generateSlug } from '../utils/generate-slug';
import { EnumProductSort, GetAllProductDto } from './dto/getAllProduct.dto';
import { PaginationService } from '../pagination/pagination.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async getAllProducts(dto: GetAllProductDto = {}) {
    const { sort, searchTerm } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];
    if (sort === EnumProductSort.LOW_TO_HIGH) {
      prismaSort.push({
        price: 'asc',
      });
    } else if (sort === EnumProductSort.HIGH_TO_LOW) {
      prismaSort.push({
        price: 'desc',
      });
    } else if (sort === EnumProductSort.OLDEST) {
      prismaSort.push({
        createdAt: 'asc',
      });
    } else {
      prismaSort.push({
        createdAt: 'desc',
      });
    }

    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    const { perPage, skip } = this.paginationService.getPagination(dto);
    const products = await this.prismaService.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: perPage,
    });
    const total = await this.prismaService.product.count({
      where: prismaSearchTermFilter,
    });
    return { products, total };
  }

  async findProductById(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      select: returnProductWithCateforyAndReviewsObject,
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        slug,
      },
      select: returnProductWithCateforyAndReviewsObject,
    });
    if (!product) throw new NotFoundException(`Product ${slug} not found`);
    return product;
  }

  async findByCategorySlug(categorySlug: string) {
    const products = await this.prismaService.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      select: returnProductWithCateforyAndReviewsObject,
    });
    if (!products)
      throw new NotFoundException(
        `Products in category ${categorySlug} not found`,
      );
    return products;
  }

  async getSimilarProducts(id: number) {
    const currentProduct = await this.findProductById(id);

    if (!currentProduct)
      throw new NotFoundException(`Product #${id} not found`);

    const products = await this.prismaService.product.findMany({
      where: {
        category: {
          name: currentProduct.category.name,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: returnProductObject,
    });
    return products;
  }

  async createProduct() {
    const product = await this.prismaService.product.create({
      data: {
        name: '',
        slug: '',
        price: 0,
        description: '',
      },
    });
    return product.id;
  }

  async updateProduct(id: number, data: ProductDto) {
    const { name, price, description, images, categoryId } = data;

    return this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        name,
        slug: generateSlug(name),
        description,
        images,
        price,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  async deleteProduct(id: number) {
    return this.prismaService.product.delete({
      where: {
        id,
      },
    });
  }
}
