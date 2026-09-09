import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DB_PORT: z.coerce.number(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  POSTGRES_EXTERNAL_PORT: z.coerce.number(),
  REDIS_EXTERNAL_PORT: z.coerce.number(),
  APP_EXTERNAL_PORT: z.coerce.number(),
  BULL_BOARD_USERNAME: z.string(),
  BULL_BOARD_PASSWORD: z.string().min(8),
  JWT_SECRET: z.string()
})
