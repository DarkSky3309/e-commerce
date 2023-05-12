import * as dotenv from 'dotenv';
import { PrismaClient, Product } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { generateSlug } from '../src/utils/generate-slug';
import { getRandomNumber } from '../src/utils/random-number';

dotenv.config();
const prisma = new PrismaClient();

const createProducts = async (quantity: number) => {
  const products: Product[] = [];

  for (let i = 0; i < quantity; i++) {
    const productName = faker.commerce.productName();
    const cateforyName = faker.commerce.department();

    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: generateSlug(productName),
        description: faker.commerce.productDescription(),
        price: +faker.commerce.price(10, 999, 0),
        images: Array.from({ length: getRandomNumber(2, 6) }).map(() =>
          faker.image.imageUrl(),
        ),
        category: {
          create: {
            name: cateforyName,
            slug: generateSlug(cateforyName),
          },
        },
        reviews: {
          create: [
            {
              rating: getRandomNumber(1, 5),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 3,
                },
              },
            },
            {
              rating: getRandomNumber(1, 5),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 3,
                },
              },
            },
          ],
        },
      },
    });
    products.push(product);
  }
  console.log(`Created ${products.length} products`);
};
async function main() {
  console.log('Start seeding ...');
  await createProducts(10);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
