import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retryWhen, delay, take, concatMap } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            retryWhen(errors => errors.pipe(
                concatMap((error, count) => {
                    if (count <= 3 && error.status === 429) { // 429 is Too Many Requests
                        const retryAfter = parseInt(error.headers.get('Retry-After'), 10) || 1000;
                        return of(error).pipe(delay(retryAfter));
                    }
                    return throwError(error);
                })
            )),
            catchError((error: HttpErrorResponse) => {
                return throwError(error);
            })
        );
    }
}
