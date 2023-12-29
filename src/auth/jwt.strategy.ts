import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 解析header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request.cookies['jwt']; // cookie名稱
        },
      ]),
      ignoreExpiration: false, // 預設為 false，若為 true 則不檢查 token 是否過期
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // console.log('jwt.strategy.ts validate payload: ', payload);
    return { id: payload.id };
  }
}
