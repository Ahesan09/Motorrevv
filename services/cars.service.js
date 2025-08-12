// src/services/cars.service.js
import { cars } from "../drizzle/schema.js";
import { eq, ilike, like, or, sql } from "drizzle-orm";
import {db} from "../config/db.js";


export const createCar = async (carData) => {
  return await db.insert(cars).values(carData);
};

export const getCars = async ({ page, limit, search }) => {
  const offset = (page - 1) * limit;

  let query = db.select().from(cars);
  let totalCountQuery = db.select({ count: sql`COUNT(*)` }).from(cars);

  if (search) {
    const searchPattern = `%${search.toLowerCase()}%`;

    query = query.where(
      or(
        sql`LOWER(${cars.brand}) LIKE ${searchPattern}`,
        sql`LOWER(${cars.model}) LIKE ${searchPattern}`
      )
    );

    totalCountQuery = totalCountQuery.where(
      or(
        sql`LOWER(${cars.brand}) LIKE ${searchPattern}`,
        sql`LOWER(${cars.model}) LIKE ${searchPattern}`
      )
    );
  }

  const data = await query.limit(Number(limit)).offset(offset);
  const totalCountResult = await totalCountQuery;
  const totalCount = Number(totalCountResult[0].count);

  return {
    data,
    total: totalCount,
    totalPages: Math.ceil(totalCount / limit),
    page: Number(page),
    limit: Number(limit),
  };
};

