import {
  INestApplication,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { LoggerService } from 'src/common/loggers/logger.service';

export function setupTestApp(app: INestApplication) {
  const loggerService = app.get(LoggerService);
  app.use(cookieParser());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(loggerService));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = {};
        errors.forEach((error) => {
          formattedErrors[error.property] = Object.values(
            error.constraints ?? {},
          );
        });
        return new BadRequestException({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );
  return app;
}
