import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ParseQueryParamsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const queryParams = request.query;

    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        const value = queryParams[key];
        if (value === 'true' || value === 'false') {
          queryParams[key] = value === 'true';
        } else if (!isNaN(Number(value))) {
          queryParams[key] = Number(value);
        }
      }
    }

    return next.handle();
  }
}
