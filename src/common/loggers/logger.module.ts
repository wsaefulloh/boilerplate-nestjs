import { Global, Module } from '@nestjs/common';
import { LoggerService } from 'src/common/loggers/logger.service';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
