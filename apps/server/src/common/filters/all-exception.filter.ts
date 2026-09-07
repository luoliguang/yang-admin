import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

/** 统一异常响应：{ code, message, data:null } */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = '服务器内部错误';
    if (exception instanceof HttpException) {
      const resp = exception.getResponse();
      message =
        typeof resp === 'string'
          ? resp
          : ((resp as Record<string, unknown>).message as string) ?? exception.message;
      if (Array.isArray(message)) message = message.join('; ');
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    }

    res.status(status).json({ code: status, message, data: null });
  }
}
