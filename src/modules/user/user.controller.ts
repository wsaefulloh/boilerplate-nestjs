import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { JwtUser } from 'src/modules/auth/interfaces/jwt-user.interface';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: { user: JwtUser }) {
    try {
      const user = await this.userService.findByEmail(req.user.userEmail);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user profile');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async update(
    @Body() dto: UpdateUserDto,
    @Param('id') id: number,
    @Req() req: { user: JwtUser },
  ) {
    try {
      // Check if the user is updating their own profile
      if (req.user.userId !== id) {
        throw new HttpException(
          'You are not authorized to update this user',
          403,
        );
      }
      return await this.userService.updateUser(dto, id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}
