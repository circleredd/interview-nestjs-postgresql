import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'id' }); // 變更預設提取的欄位名稱，預設為 username
    //super();
  }

  // passport 會自動把 req.body 裡面的 username 和 password 取出來，若要變更這兩個欄位名稱，可以在 super() 裡面傳入 { usernameField: 'id' } 來變更 username 欄位名稱
  async validate(id: string, password: string) {
    const user = await this.authService.validate(id, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const token = await this.authService.createToken(
      user.id,
      user.name,
      user.age,
    );
    return { user, token };
    // return user; // passport 會自動把 user 存到 req.user 裡面
  }
}
