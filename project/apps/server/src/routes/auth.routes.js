import { Router } from "express";
import { store } from "../db/store.js";
import { hashPassword, publicUser, signToken, verifyPassword } from "../services/auth.service.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ error: "Name, valid email, and password with at least 8 characters are required" });
    }

    const user = await store.createUser({
      name,
      email,
      password_hash: await hashPassword(password)
    });
    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const user = email ? await store.findUserByEmail(email) : null;
    if (!user || !(await verifyPassword(password || "", user.password_hash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});
