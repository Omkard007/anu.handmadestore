import 'dotenv/config';
import prisma from '../lib/prisma.js';
import { productsData } from '../lib/productsData.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Start seeding...");

  const adminPassword = await bcrypt.hash('adminpassword123', 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@handmade.com" },
    update: {},
    create: {
      email: "admin@handmade.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log({ admin });

  // Create Products
  for (const product of productsData) {
    let base64Image = product.imagePath;

    // Convert local image path to base64 if it starts with /assets
    if (product.imagePath.startsWith('/assets')) {
      try {
        const filePath = path.join(__dirname, '../public', product.imagePath);
        if (fs.existsSync(filePath)) {
          const imageBuffer = fs.readFileSync(filePath);
          const extension = path.extname(filePath).replace('.', '');
          const mimeType = extension === 'jpeg' || extension === 'jpg' ? 'image/jpeg' : `image/${extension}`;
          base64Image = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
          console.log(`Converted ${product.name} image to base64`);
        } else {
          console.warn(`File not found: ${filePath}`);
        }
      } catch (err) {
        console.error(`Error converting image for ${product.name}:`, err);
      }
    }

    const p = await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        imagePath: base64Image,
        inStock: product.inStock,
        rating: product.rating,
        isFeatured: product.isFeatured,
      },
      create: {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        imagePath: base64Image,
        inStock: product.inStock,
        rating: product.rating,
        isFeatured: product.isFeatured,
      },
    });
    console.log(`Created/Updated product: ${p.name}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
