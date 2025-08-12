// drizzle/schema/cars.js
import { mysqlTable, int, varchar, decimal, text, timestamp } from "drizzle-orm/mysql-core";

export const cars = mysqlTable("cars", {
  id: int("id").primaryKey().autoincrement(),
  brand: varchar("brand", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  year: int("year").notNull(),
  price: decimal("price", 10, 2).notNull(),
  fuelType: varchar("fuel_type", { length: 50 }).notNull(),
  transmission: varchar("transmission", { length: 50 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});
