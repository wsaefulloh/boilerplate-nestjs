import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { User } from 'src/modules/user/user.entity';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { hashPassword } from 'src/common/utils/password.util';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { LoggerService } from 'src/common/loggers/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly logger: LoggerService, // inject Winston logger
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepo.findOne({
        where: {
          email: dto.email,
        },
      });
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
      const user = this.userRepo.create(dto);
      return await this.userRepo.save(user);
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
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
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async findById(id: number): Promise<User> {
    return await this.findOne({ id });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.findOne({ email });
  }

  async updateUser(dto: UpdateUserDto, userId: number): Promise<User> {
    try {
      const existingUser = await this.userRepo.findOne({
        where: {
          email: dto.email,
          id: Not(userId),
        },
      });
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
      const hashedPassword = await hashPassword(dto.password);
      await this.userRepo.update(
        { id: userId },
        {
          ...dto,
          password: hashedPassword,
        },
      );

      return this.findById(userId);
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}
