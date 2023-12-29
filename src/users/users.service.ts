import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async getProfile(id: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('u') // u為查詢中的alias別名, 可以任意自訂
      .select(['u.id', 'u.name', 'u.age'])
      .where('u.id = :id', { id: id })
      .getOne();
    return user;
  }
}
