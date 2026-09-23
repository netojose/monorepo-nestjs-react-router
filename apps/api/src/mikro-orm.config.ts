import 'dotenv/config'
import { Migrator } from '@mikro-orm/migrations'
import { defineConfig } from '@mikro-orm/postgresql'

export default defineConfig({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: ['dist/modules/**/*.entity.js'],
  entitiesTs: ['src/modules/**/*.entity.ts'],
  debug: process.env.NODE_ENV !== 'production',
  extensions: [Migrator],
  migrations: {
    path: 'dist/database/migrations',
    pathTs: 'src/database/migrations'
  }
})
