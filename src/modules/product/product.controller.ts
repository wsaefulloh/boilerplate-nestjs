import {
  Controller,
  HttpException,
  InternalServerErrorException,
  UseGuards,
  Post,
  Body,
  Req,
  Get,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { JwtUser } from 'src/modules/auth/interfaces/jwt-user.interface';
import { ProductService } from 'src/modules/product/product.service';
import { ProductQueryDto } from 'src/modules/product/dto/query-product.dto';
import { CreateProductDto } from 'src/modules/product/dto/create-product.dto';
import { UpdateProductDto } from 'src/modules/product/dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: { user: JwtUser }, @Body() dto: CreateProductDto) {
    try {
      return await this.productService.create(dto, req.user.userEmail);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    try {
      return await this.productService.findAll(query);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-products')
  async findAllProductsByUsers(
    @Query() query: ProductQueryDto,
    @Req() req: { user: JwtUser },
  ) {
    try {
      return await this.productService.findByUser(req.user.userEmail, query);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.productService.findById(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @Req() req: { user: JwtUser },
  ) {
    try {
      return await this.productService.update(dto, id, req.user.userEmail);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: JwtUser },
  ) {
    try {
      return await this.productService.softDelete(id, req.user.userEmail);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
