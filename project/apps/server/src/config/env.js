import dotenv from "dotenv";

dotenv.config({ path: new URL("../../../../.env", import.meta.url) });
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  host: process.env.HOST || "127.0.0.1",
  jwtSecret: process.env.JWT_SECRET || "dev-only-change-me",
  databaseUrl: process.env.DATABASE_URL || ""
};

export const isMariaDbEnabled = Boolean(env.databaseUrl);
