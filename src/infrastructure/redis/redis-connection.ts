import IORedis from "ioredis";
import { env } from "../../core/config/env";

export const redisConnection = new IORedis({
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
  password: env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});
