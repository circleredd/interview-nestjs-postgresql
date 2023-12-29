import {
  Request,
  Response,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('test')
  testGet(@Response() res) {
    return res.json(this.authService.test());
  }

  @Public()
  @Post('signup')
  async signup(@Request() req, @Response() res) {
    const user = await this.authService.createUser(req.body);
    return res.json(user);
  }

  @Public()
  @UseGuards(LocalAuthGuard) // passport 會自動把 validator 回傳的資料存到 req.user 裡面，user為預設，可在local.strategy.ts中super()更改
  @Post('login')
  login(@Request() req, @Response() res) {
    // res.header('Authorization', `Bearer ${req.user.token}`);
    res.cookie('jwt', req.user.token, { httpOnly: true });
    return res.json(req.user.user);
  }

  @Post('logout')
  logout(@Response() res) {
    res.cookie('jwt', '', { httpOnly: true, maxAge: 0 });
    return res.json({ status: 200, message: 'logout success !' });
  }
}
