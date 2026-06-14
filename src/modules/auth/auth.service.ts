import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hashPassword, comparePassword } from 'src/common/utils/password.util';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { UserService } from 'src/modules/user/user.service';
import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { User } from 'src/modules/user/user.entity';
import { StringValue } from 'ms';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { JwtRefreshPayload } from 'src/modules/auth/interfaces/jwt-refresh-payload.interface';
import { LoggerService } from 'src/common/loggers/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly logger: LoggerService, // inject Winston logger
  ) {}

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
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  generateAccessToken(user: User) {
    try {
      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
      };
      return this.jwtService.sign(payload);
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  generateRefreshToken(user: User) {
    try {
      const refreshPayload: JwtRefreshPayload = { email: user.email };
      return this.jwtService.sign(refreshPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_SECRET_EXPIRES_IN as StringValue,
      });
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.validateUser(email, password);
      return {
        accessToken: this.generateAccessToken(user),
        refreshToken: this.generateRefreshToken(user),
      };
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async refresh(refreshToken: string) {
    try {
      const refreshPayload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.userService.findByEmail(refreshPayload.email);
      return {
        accessToken: this.generateAccessToken(user),
      };
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw error;
    }
  }
}
