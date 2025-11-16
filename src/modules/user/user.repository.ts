import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../database/models/user.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  create(data: Partial<User>): Promise<User> {
    return this.userModel.create(data);
  }

  findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  findOne(id: number): Promise<User> {
    return this.userModel.findByPk(id);
  }

  update(id: number, data: Partial<User>): Promise<[number, User[]]> {
    return this.userModel.update(data, { where: { id }, returning: true });
  }

  delete(id: number): Promise<number> {
    return this.userModel.destroy({ where: { id } });
  }
}
