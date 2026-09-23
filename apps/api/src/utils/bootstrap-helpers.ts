import helmet from '@fastify/helmet'
import { StandardSchemaValidationPipe, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions } from '@nestjs/swagger'

import * as packageJson from '../../package.json' with { type: 'json' }
import { validationExceptionFactory } from './validation-exception-factory.js'

export function configSwagger(app: NestFastifyApplication, uri: string): void {
  const configService = app.get(ConfigService)
  const environment = configService.get<'development' | 'production'>('NODE_ENV')

  if (environment !== 'development') {
    return
  }

  const { description, version } = packageJson.default

  const config = new DocumentBuilder()
    .setTitle(description)
    .setDescription(`${description} REST API specification`)
    .setVersion(version)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build()

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      const cnt = controllerKey.replace('Controller', '')
      const controller = cnt.charAt(0).toLowerCase() + cnt.slice(1)
      const action = methodKey.charAt(0).toUpperCase() + methodKey.slice(1)
      return `${controller}${action}`
    }
  }

  const documentFactory = () => SwaggerModule.createDocument(app, config, options)

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true
    },
    customSiteTitle: description
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
