import {
  Catch,
  BadRequestException,
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponseType {
  message: string | [string];
  statusCode: number;
  error: string;
}

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();
    let message = '';

    if (typeof errorResponse === 'string') {
      return response.status(status).json(exception.getResponse());
    }

    const convertErrorResponse = errorResponse as ErrorResponseType;

    if (typeof convertErrorResponse.message === 'string') {
      message = convertErrorResponse.message;
    } else {
      message = convertErrorResponse.message[0];
    }
    response.status(status).json({
      statusCode: status,
      message,
      error: convertErrorResponse.error,
    });
  }
}
