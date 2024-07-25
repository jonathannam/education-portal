import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message;

    const formattedErrors = Array.isArray(message)
      ? message
          .map((err) => {
            return typeof err === 'object'
              ? Object.values(err.constraints).join(', ')
              : err;
          })
          .join(', ')
      : message;

    const errorJsonResponse = {
      statusCode: HttpStatus.BAD_REQUEST,
      message: formattedErrors,
      error: 'Bad Request',
    };
    response.status(HttpStatus.BAD_REQUEST).json(errorJsonResponse);
  }
}
