import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;

        const start = Date.now();

        return next.handle().pipe(
            tap((data) => {
                const response = context.switchToHttp().getResponse();
                const statusCode = response.statusCode;
                const duration = Date.now() - start;
                this.logger.log(`${method} ${url} ${statusCode} - ${duration}ms`);
            }),
        );
    }
}
