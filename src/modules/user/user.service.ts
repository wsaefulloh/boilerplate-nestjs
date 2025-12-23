import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
