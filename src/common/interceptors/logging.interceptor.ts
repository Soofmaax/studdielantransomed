import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Response } from 'express';

interface LogContext {
  method: string;
  url: string;
  statusCode: number;
  duration: number;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        const logContext: LogContext = {
          method,
          url,
          statusCode: response.statusCode,
          duration: Date.now() - now,
        };
        this.logger.log(
          `${logContext.method} ${logContext.url} ${logContext.statusCode} ${logContext.duration}ms`
        );
      }),
    );
  }
}