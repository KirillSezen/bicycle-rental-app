import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { Request, Response } from 'express';

interface ErrorResponseBody {
  statusCode: number;
  error: string;
  message: string | string[];
  details: unknown;
  path: string;
  timestamp: string;
}

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionsFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, error, message, details } = this.resolve(exception);

    const body: ErrorResponseBody = {
      statusCode: status,
      error,
      message,
      details,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json(body);
  }

  private resolve(exception: unknown): {
    status: number;
    error: string;
    message: string | string[];
    details: unknown;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null) {
        const response = res as Record<string, unknown>;
        return {
          status,
          error: (response.error as string) ?? HttpStatus[status] ?? 'Error',
          message: Array.isArray(response.message)
            ? exception.message
            : (response.message as string | string[]),
          details: Array.isArray(response.message) ? response.message : null,
        };
      }

      return {
        status,
        error: HttpStatus[status] ?? 'Error',
        message: exception.message,
        details: null,
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.prismaError(exception);
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Внутренняя ошибка сервера',
      details: null,
    };
  }

  private prismaError(error: Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: 'Запись с такими данными уже существует',
          details: error.meta?.target ?? null,
        };
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: 'Запись не найдена',
          details: null,
        };
      case 'P2003':
        return {
          status: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: 'Операция нарушает связи с другими записями',
          details: null,
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
          message: 'Ошибка базы данных',
          details: null,
        };
    }
  }
}
