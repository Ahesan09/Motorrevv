import { db } from "../config/db.js";
import { usersTable } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const getUserByEmail = async (email) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  return user;
};

export const createUser = async ({ name, email, password, phone,userImage,role }) => {
  const [result] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password, // already hashed
      phone,
      userImage,
      role
    });

  return { id: result.insertId,role,userImage}; // works like $returningId() but for MySQL
};

export const hashPassword = async (password) => {
  return argon2.hash(password);
};

export const comparePassword = async (password, hash) => {
  return argon2.verify(hash, password);
};

export const createAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};
