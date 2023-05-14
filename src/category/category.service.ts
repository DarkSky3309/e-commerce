import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { returnCategoryObject } from './return-category.object';
import { CategoryDto } from './category.dto';
import { generateSlug } from '../utils/generate-slug';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: { id: id },
      select: returnCategoryObject,
    });
    if (!category) throw new NotFoundException(`Category #${id} not found`);
    return category;
  }

  async updateCategory(id: number, data: CategoryDto) {
    return this.prismaService.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: generateSlug(data.name),
      },
    });
  }

  async deleteCategory(id: number) {
    return this.prismaService.category.delete({
      where: { id },
    });
  }

  async createCategory() {
    return this.prismaService.category.create({
      data: {
        name: '',
        slug: '',
      },
    });
  }

  async findBySlug(slug: string) {
    const category = await this.prismaService.category.findUnique({
      where: { slug: slug },
      select: returnCategoryObject,
    });
    if (!category) throw new NotFoundException(`Category #${slug} not found`);
    return category;
  }

  async findAll() {
    return this.prismaService.category.findMany({
      select: returnCategoryObject,
    });
  }
}
