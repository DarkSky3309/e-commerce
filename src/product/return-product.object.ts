import { Prisma } from '@prisma/client';
import { returnReviewObject } from '../rewiev/return-review.object';
import { returnCategoryObject } from '../category/return-category.object';

export const returnProductObject: Prisma.ProductSelect = {
  id: true,
  name: true,
  price: true,
  description: true,
  images: true,
  slug: true,
  createdAt: true,
};

export const returnProductWithCateforyAndReviewsObject: Prisma.ProductSelect = {
  ...returnProductObject,
  reviews: {
    select: returnReviewObject,
  },
  category: {
    select: returnCategoryObject,
  },
};