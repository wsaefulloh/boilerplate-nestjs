import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'Boilerplate NestJS by Wahyu Saefulloh',
  env: process.env.NODE_ENV || 'development',
  timezone: process.env.TZ || 'Asia/Jakarta',
  port: parseInt(process.env.APP_PORT || '3000', 10),
}));
