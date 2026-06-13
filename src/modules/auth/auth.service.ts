import { Injectable } from '@nestjs/common';
import { hashPassword } from '../../common/utils/password.util';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(dto: RegisterDto) {
    try {
      // Hash the password before saving the user
      const hashedPassword = await hashPassword(dto.password);
      // Create the user with the hashed password
      return await this.userService.createUser({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        isActive: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
