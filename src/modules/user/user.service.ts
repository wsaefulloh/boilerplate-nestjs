import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/database/models/user.model';

@Injectable()
export class UserService {
  constructor(private repo: UserRepository) {}

  create(data: Partial<User>): Promise<User> {
    return this.repo.create(data);
  }

  findAll(): Promise<User[]> {
    return this.repo.findAll();
  }

  findOne(id: number): Promise<User> {
    return this.repo.findOne(id);
  }

  update(id: number, data: Partial<User>): Promise<[number, User[]]> {
    return this.repo.update(id, data);
  }

  delete(id: number): Promise<number> {
    return this.repo.delete(id);
  }
}
