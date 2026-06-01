import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const TOKEN_TTL = "2h";

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(user) {
  return jwt.sign(
    {
      sub: String(user.user_id),
      email: user.email,
      name: user.name
    },
    env.jwtSecret,
    { expiresIn: TOKEN_TTL }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function publicUser(user) {
  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email
  };
}

export function publicNativeUser(user) {
  return {
    id: String(user.user_id),
    name: user.name,
    email: user.email
  };
}
