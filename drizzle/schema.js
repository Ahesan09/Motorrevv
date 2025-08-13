// drizzle/schema/cars.js
import { mysqlTable, int, varchar, decimal, text, timestamp, json,boolean} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
export const cars = mysqlTable("cars", {
  id: int("id").primaryKey().autoincrement(),
  brand: varchar("brand", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  year: int("year").notNull(),
  price: decimal("price", 10, 2).notNull(),
  fuelType: varchar("fuel_type", { length: 50 }).notNull(),
  transmission: varchar("transmission", { length: 50 }).notNull(),
  description: text("description"),
  image: json("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow().defaultNow(),
});


export const usersTable = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  userImage: text("user_image"),
  role: varchar("role", { length: 50 }).default("user").notNull(), // <-- added role field
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});


export const sessionsTable = mysqlTable("sessions", {
  id: int().autoincrement().primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  valid: boolean().default(true).notNull(),
  userAgent: text("user_agent"),
  ip: varchar({ length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});


export const sessionsRelation = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId], // foreign key
    references: [usersTable.id],
  }),
}));