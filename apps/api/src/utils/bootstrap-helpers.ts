import helmet from '@fastify/helmet'
import { StandardSchemaValidationPipe, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger'

import * as packageJson from '../../package.json' with { type: 'json' }
import { validationExceptionFactory } from './validation-exception-factory.js'

export function configSwagger(app: NestFastifyApplication, uri: string): void {
  const configService = app.get(ConfigService)
  const environment = configService.get<'development' | 'production'>('NODE_ENV')

  if (environment !== 'development') {
    return
  }

  const config = new DocumentBuilder()
    .setTitle('PearlFresh API')
    .setDescription('PearlFresh REST API specification')
    .setVersion(packageJson.default.version)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true
    },
    customSiteTitle: 'PearlFresh API'
  }

  SwaggerModule.setup(uri, app, documentFactory, customOptions)
}

export function configValidation(app: NestFastifyApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, exceptionFactory: validationExceptionFactory }),
    new StandardSchemaValidationPipe()
  )
}

export async function configHelmet(app: NestFastifyApplication): Promise<void> {
  await app.register(helmet, { crossOriginResourcePolicy: false })
}
