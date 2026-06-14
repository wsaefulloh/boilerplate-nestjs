import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like, Not } from 'typeorm';
import { Product } from 'src/modules/product/product.entity';
import { CreateProductDto } from 'src/modules/product/dto/create-product.dto';
import { User } from 'src/modules/user/user.entity';
import { ProductQueryDto } from 'src/modules/product/dto/query-product.dto';
import { UpdateProductDto } from 'src/modules/product/dto/update-product.dto';
import { LoggerService } from 'src/common/loggers/logger.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly logger: LoggerService, // inject Winston logger
  ) {}

  async create(dto: CreateProductDto, userEmail: string) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const userLogin = await manager.findOne(User, {
          where: {
            email: userEmail,
          },
        });

        // Check if user exists
        if (!userLogin) {
          throw new NotFoundException('User not found');
        }

        const existingProduct = await manager.findOne(Product, {
          where: {
            name: dto.name,
            user: {
              id: userLogin.id,
            },
          },
        });

        // Check for duplicate product name for the same user
        if (existingProduct) {
          throw new ConflictException(
            'You already have a product with this name',
          );
        }

        // Create and save the product
        const product = await manager.save(Product, {
          ...dto,
          user: userLogin,
        });

        return {
          message: 'Product created successfully',
          data: {
            ...product,
            user: {
              name: userLogin.name,
              email: userLogin.email,
            },
          },
        };
      });
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async findAll(query: ProductQueryDto) {
    try {
      const { search, page, limit } = query;

      // Use findAndCount to get both the products and the total count for pagination
      const [products, total] = await this.productRepo.findAndCount({
        where: {
          isActive: true,
          deletedAt: null,
          ...(search && {
            name: Like(`%${search}%`),
          }),
        },
        take: limit,
        skip: (page - 1) * limit,
        order: {
          id: 'DESC',
        },
      });

      return {
        data: products,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async findByUser(userEmail: string, query: ProductQueryDto) {
    try {
      const { search, page, limit } = query;

      const userLogin = await this.userRepo.findOne({
        where: {
          email: userEmail,
        },
      });

      // Check if user exists
      if (!userLogin) {
        throw new NotFoundException('User not found');
      }

      // Use findAndCount to get both the products and the total count for pagination
      const [products, total] = await this.productRepo.findAndCount({
        where: {
          user: {
            id: userLogin.id,
          },
          deletedAt: null,
          ...(search && {
            name: Like(`%${search}%`),
          }),
        },
        take: limit,
        skip: (page - 1) * limit,
        order: {
          id: 'DESC',
        },
      });

      return {
        data: products,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async findById(productId: number) {
    try {
      const product = await this.productRepo.findOne({
        where: {
          id: productId,
          isActive: true,
          deletedAt: null,
        },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return product;
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async update(dto: UpdateProductDto, productId: number, userEmail: string) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const userLogin = await manager.findOne(User, {
          where: {
            email: userEmail,
          },
        });

        // Check if user exists
        if (!userLogin) {
          throw new NotFoundException('User not found');
        }

        const existingProduct = await manager.findOne(Product, {
          where: {
            id: productId,
            user: {
              id: userLogin.id,
            },
          },
        });

        // Check if product exists and belongs to the user
        if (!existingProduct) {
          throw new NotFoundException('Product not found');
        }

        const existingProductName = await manager.findOne(Product, {
          where: {
            id: Not(productId),
            name: dto.name,
            user: {
              id: userLogin.id,
            },
          },
        });

        // Check for duplicate product name for the same user
        if (existingProductName) {
          throw new ConflictException(
            'You already have a product with this name',
          );
        }

        // Update the product
        await manager.update(
          Product,
          { id: productId },
          {
            name: dto.name,
            description: dto.description,
            price: dto.price,
            isActive: dto.is_active,
            user: userLogin,
          },
        );

        // Get the updated product details
        const resultProduct = await manager.findOne(Product, {
          where: {
            id: productId,
          },
        });

        return {
          message: 'Product Updated successfully',
          data: {
            ...resultProduct,
            user: {
              name: userLogin.name,
              email: userLogin.email,
            },
          },
        };
      });
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async softDelete(productId: number, userEmail: string) {
    try {
      const userLogin = await this.userRepo.findOne({
        where: {
          email: userEmail,
        },
      });

      // Check if user exists
      if (!userLogin) {
        throw new NotFoundException('User not found');
      }

      const product = await this.productRepo.findOne({
        where: {
          user: {
            id: userLogin.id,
          },
          id: productId,
          deletedAt: null,
        },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      await this.productRepo.update(product.id, {
        deletedAt: new Date(),
      });

      return {
        message: 'Product deleted successfully',
      };
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}
