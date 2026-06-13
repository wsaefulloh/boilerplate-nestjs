import {
  Controller,
  Post,
  Body,
  ConflictException,
  InternalServerErrorException,
  HttpException,
  Res,
  Req,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
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

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        body.email,
        body.password,
      );
      // Set refresh token in HTTP-only cookie
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        domain: process.env.COOKIE_DOMAIN,
        path: '/auth/refresh',
      });
      return { accessToken };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request) {
    try {
      const refreshToken = req.cookies?.refresh_token;
      if (!refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return await this.authService.refresh(refreshToken);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Refresh token failed');
    }
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', {
      path: '/auth/refresh',
    });
    return { message: 'Logged out' };
  }
}
