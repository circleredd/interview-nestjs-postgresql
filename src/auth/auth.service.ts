import { UnauthorizedException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { responeDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  test(): responeDto {
    return { status: 200, message: 'test' };
  }

  async findUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async validate(id: string, password: string): Promise<User | null> {
    const user = await this.findUserById(id);
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (user && isPasswordMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user; //宣告result = user，但不包含password
      return result as User;
    }
    return null;
  }

  async createToken(id: string, name: string, age: number): Promise<string> {
    const payload = { id, name, age };
    const token = await this.jwtService.signAsync(payload);

    return token;
  }

  async createUser(req): Promise<responeDto> {
    try {
      const { id, password, passwordCheck, name, age } = req;
      const user = await this.findUserById(id);

      if (user) {
        throw new UnauthorizedException('User already exists');
      } else if (password !== passwordCheck) {
        throw new UnauthorizedException('Passwordcheck does not match');
      }

      const hashPassword = await bcrypt.hash(password, 12);
      await this.userRepository.save({
        id: id,
        password: hashPassword,
        name,
        age,
      });

      return { status: 200, message: 'Signup Success!' };
    } catch (error) {
      throw new UnauthorizedException('User creation failed', error.message);
    }
  }
}
