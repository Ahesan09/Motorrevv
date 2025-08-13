import { db } from "../config/db.js";
import { sessionsTable, usersTable } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  MILLISECONDS_PER_SECOND,
} from "../config/constant.js";

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

export const findUserById = async (userId) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  return user;
};

export const hashPassword = async (password) => {
  return argon2.hash(password);
};

export const comparePassword = async (password, hash) => {
  return argon2.verify(hash, password);
};
export const createSession = async (userId, { ip, userAgent }) => {
  const [session] = await db
    .insert(sessionsTable)
    .values({ userId, ip, userAgent })
    .$returningId();

  return session;
};

export const createAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};
export const createRefreshToken = (sessionId) => {
  return jwt.sign({ sessionId }, process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND, //   expiresIn: "1w",
  });
};

export const verifyJWTToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const findSessionById = async (sessionId) => {
  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.id, sessionId));

  return session;
};
export const refreshTokens = async (refreshToken) => {
  try {
    const decodedToken = verifyJWTToken(refreshToken);
    const currentSession = await findSessionById(decodedToken.sessionId);

    if (!currentSession || !currentSession.valid) {
      throw new Error("Invalid session");
    }

    const user = await findUserById(currentSession.userId);

    if (!user) throw new Error("Invalid User");

    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      sessionId: currentSession.id,
    };

    const newAccessToken = createAccessToken(userInfo);
    const newRefreshToken = createRefreshToken(currentSession.id);

    return {
      newAccessToken,
      newRefreshToken,
      user: userInfo,
    };
  } catch (error) {
    console.log(error.message);
  }
};

export const authenticateUser = async ({ req, res, user, name, email }) => {
  // we need to create a sessions
  const session = await createSession(user.id, {
    ip: req.clientIp,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = createAccessToken({
    id: user.id,
    name: user.name || name,
    email: user.email || email,
    sessionId: session.id,
  });

  const refreshToken = createRefreshToken(session.id);

  const baseConfig = { httpOnly: true, secure: true };

  res.cookie("access_token", accessToken, {
    ...baseConfig,
    maxAge: ACCESS_TOKEN_EXPIRY,
  });

  res.cookie("refresh_token", refreshToken, {
    ...baseConfig,
    maxAge: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};