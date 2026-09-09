import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { useContainer } from 'class-validator'

import { AppModule } from './modules/app/app.module.js'
import { configHelmet, configSwagger, configValidation } from './utils/bootstrap-helpers.js'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  configValidation(app)

  configSwagger(app, 'docs')

  await configHelmet(app)

  app.enableShutdownHooks()

  await app.listen(3000, '0.0.0.0')
}
await bootstrap()
