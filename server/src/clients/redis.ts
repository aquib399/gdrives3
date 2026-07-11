import { REDIS_CONFIG } from "@/configs/env.js";
import { Redis, RedisOptions } from "ioredis";

const options: RedisOptions = {
  username: REDIS_CONFIG.USERNAME,
  password: REDIS_CONFIG.PASSWORD,
  host: REDIS_CONFIG.HOST,
  port: REDIS_CONFIG.PORT,
  maxRetriesPerRequest: 2,
  enableOfflineQueue: false,
  lazyConnect: true,
  connectTimeout: 3_000,
  ...(REDIS_CONFIG.TLS ? { tls: { rejectUnauthorized: false } } : undefined),
  retryStrategy: (attempt) => Math.min(attempt * 500, 5_000)
};

export const redis = new Redis(options);

redis.on("connect", () =>
  console.log(`Redis connected: ${REDIS_CONFIG.HOST}:${REDIS_CONFIG.PORT}`)
);
redis.on("error", (err) => console.warn("Redis error:", err.message));

export async function connectRedis() {
  console.log("Connecting to Redis...");
  await redis.connect().catch(() => {
    console.warn("Redis unavailable — running without cache");
  });
}
connectRedis();
