import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { UserController } from './controllers/user.controller.js'
import { User } from './entities/user.entity.js'
import { UserService } from './services/user.service.js'

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
