import { env, isMariaDbEnabled } from "../config/env.js";
import { createMariaDbStore } from "./mariadb-store.js";
import { createMemoryStore } from "./memory-store.js";

export const store = isMariaDbEnabled ? createMariaDbStore(env.databaseUrl) : createMemoryStore();
