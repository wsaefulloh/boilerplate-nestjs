import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: true,
    }),
  ],
})
export class TestDatabaseModule {}
