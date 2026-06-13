import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(data: Partial<User>): Promise<User> {
    try {
      const user = this.userRepo.create(data);
      return await this.userRepo.save(user);
    } catch (error) {
      throw error;
    }
  }
}
