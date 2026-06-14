import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from 'src/config/database.config';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { LoggerModule } from 'src/common/loggers/logger.module';
import { ProductModule } from 'src/modules/product/product.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    // Configure ConfigModule to load database configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    // Configure TypeOrmModule with database connection settings
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 second
        limit: 10, // Max 10 request
      },
    ]),

    // Import Module
    UserModule,
    AuthModule,
    LoggerModule,
    ProductModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
