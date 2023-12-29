import { Controller, Get, Request } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req) {
    const { id } = req.user;
    return this.usersService.getProfile(id);
  }
}
