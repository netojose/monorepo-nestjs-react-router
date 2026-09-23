import { Controller, Get } from '@nestjs/common'

import { UserService } from '../services/user.service.js'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getName()
  }
}
