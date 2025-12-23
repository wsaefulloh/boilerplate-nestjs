import { Injectable } from '@nestjs/common';
import { hashPassword } from '../../common/utils/password.util';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await hashPassword(dto.password);

    const user = await this.userService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      isActive: true,
    });

    return user;
  }
}
