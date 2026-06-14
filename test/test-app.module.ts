import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ProductModule } from 'src/modules/product/product.module';
import { LoggerModule } from 'src/common/loggers/logger.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: true,
    }),

    UserModule,
    AuthModule,
    ProductModule,
    LoggerModule,
  ],
})
export class TestAppModule {}
