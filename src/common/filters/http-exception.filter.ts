import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../loggers/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LoggerService) private loggerService: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = (exceptionResponse as any).message || message;
        errors = (exceptionResponse as any).errors || null;
      }
    }

    this.loggerService.error(message, {
      status,
      errors,
      path: request.url,
      method: request.method,
      stack: (exception as any)?.stack,
    });

    const timestamp =
      new Date()
        .toLocaleString('sv-SE', {
          timeZone: process.env.TZ || 'Asia/Jakarta',
        })
        .replace(' ', 'T') + '+07:00';

    response.status(status).json({
      success: false,
      message,
      errors,
      path: request.url,
      timestamp: timestamp,
    });
  }
}
