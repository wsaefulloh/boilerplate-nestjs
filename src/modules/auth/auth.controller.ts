import {
  Controller,
  Post,
  Body,
  ConflictException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      // Re-throw known HTTP exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      // Handle duplicate email error
      if ((error as any)?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already registered');
      }
      // Log unexpected errors and throw a generic internal server error
      throw new InternalServerErrorException('Failed to register user');
    }
  }
}
