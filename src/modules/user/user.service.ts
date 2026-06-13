import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepo.create(data);
      return await this.userRepo.save(user);
    } catch (error) {
      throw error;
    }
  }

  // Helper method to find one user or throw NotFoundException
  private async findOne(where: FindOptionsWhere<User>): Promise<User> {
    try {
      const user = await this.userRepo.findOne({ where });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<User> {
    return await this.findOne({ id });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.findOne({ email });
  }
}
