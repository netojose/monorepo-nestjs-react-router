import * as http from 'node:http'

import { FastifyAdapter } from '@bull-board/fastify'
import { BullBoardModule } from '@bull-board/nestjs'
import { createKeyv } from '@keyv/redis'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { BullModule } from '@nestjs/bullmq'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { KeyvCacheableMemory } from 'cacheable'
import { Keyv } from 'keyv'

import mikroOrmConfig from '../../mikro-orm.config.js'
import { bullBoardAuthMiddleware } from '../../utils/bull-board-auth-middleware.js'
import { envSchema } from '../../utils/config-validation-schema.js'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validationSchema: envSchema }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [
            createKeyv('redis://redis:6379'),
            new Keyv({
              store: new KeyvCacheableMemory({ ttl: 60000, lruSize: 5000 })
            })
          ]
        }
      }
    }),
    BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379
      }
    }),
    BullBoardModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        route: '/queues',
        adapter: FastifyAdapter,
        boardOptions: {
          uiConfig: {
            hideRedisDetails: false,
            showMetrics: true,
            showWorkers: true,
            hasHistoryProvider: true,
            hasHistoryUsage: true,
            canPurgeHistory: true,
            hasLatencyHistory: true
          }
        },
        middleware: (req: http.IncomingMessage, res: http.ServerResponse, next: VoidFunction) => {
          const checkUser = config.getOrThrow('BULL_BOARD_USERNAME')
          const checkPassword = config.getOrThrow('BULL_BOARD_PASSWORD')
          bullBoardAuthMiddleware(req, res, next, checkUser, checkPassword)
        }
      })
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10
        }
      ]
    }),
    EventEmitterModule.forRoot(),
    MikroOrmModule.forRoot(mikroOrmConfig)
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    AppService
  ]
})
export class AppModule {}
