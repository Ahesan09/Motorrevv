// drizzle/seed.js
import { db } from "../config/db.js";
import { cars } from "./schema.js";
import { faker } from "@faker-js/faker";

async function seed(count = 15) {
  const carData = [];

  for (let i = 0; i < count; i++) {
    carData.push({
      brand: faker.vehicle.manufacturer(), // e.g., Toyota, BMW
      model: faker.vehicle.model(), // e.g., Corolla, Model S
      year: faker.number.int({ min: 2000, max: 2025 }),
      price: faker.number.float({ min: 5000, max: 100000, precision: 0.01 }),
      fuelType: faker.helpers.arrayElement([
        "Petrol",
        "Diesel",
        "Electric",
        "Hybrid"
      ]),
      transmission: faker.helpers.arrayElement([
        "Automatic",
        "Manual"
      ]),
      description: faker.lorem.sentence(),
      imageUrl: faker.image.url(), // random image URL
    });
  }

  await db.insert(cars).values(carData);

  console.log(`✅ ${count} cars seeded successfully!`);
  process.exit(0);
}

// Run with default 100, or pass another count via CLI arg
seed(process.argv[2] ? parseInt(process.argv[2]) : 100);
