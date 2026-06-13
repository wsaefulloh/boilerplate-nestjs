import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/common/utils/password.util';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async updateUser(dto: UpdateUserDto, user_id: number): Promise<User> {
    try {
      const hashedPassword = await hashPassword(dto.password);
      await this.userRepo.update(
        { id: user_id },
        {
          ...dto,
          password: hashedPassword,
        },
      );

      return this.findById(user_id);
    } catch (error) {
      throw error;
    }
  }
}
