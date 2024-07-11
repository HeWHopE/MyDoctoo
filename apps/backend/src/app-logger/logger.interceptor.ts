import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import config from '../config/config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  constructor(@Inject(config.KEY) private readonly configObject: ConfigType<typeof config>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (this.configObject.NODE_ENV !== 'development') return next.handle();

    const ctx = context.switchToHttp();
    const req: Request = ctx.getRequest();

    return next.handle().pipe(
      tap(data => {
        this.logger.log(`
================Start of Req================
${this.reqLog(req)}

${this.resLog(req.res, data)}
=================End of Req=================
        `);
      }),
    );
  }

  private reqLog(req: Request): string {
    const { method, originalUrl: url, body, cookies } = req;
    return `${method} ${url}
Cookies:
${JSON.stringify(cookies, null, 2)}
Body:
${JSON.stringify(body, null, 2)}
`;
  }

  private resLog(res: Response, data: any): string {
    const { statusCode } = res;
    const { method, originalUrl: url } = res.req;

    return `Sent(${statusCode}): ${method} ${url}
Response Body:
${JSON.stringify(data, null, 2)}
`;
  }
}
