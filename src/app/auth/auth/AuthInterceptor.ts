import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

   
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const authToken = localStorage.getItem('token');
        const externalToken = '546055cac6cf4b7ebb0ba79b86cd86ece522e23686314f7f848da2883d8af6ea';

        // Verifica si la URL es del endpoint externo
        if (request.url.includes('https://apiperu.dev/api')) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${externalToken}`
                }
            });
        } else if (authToken) {
            // Aplica el token de autenticación predeterminado
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${authToken}`
                }
            });
        }

        return next.handle(request);





        // const token = localStorage.getItem('token');
        // if (token) {
        //     request = request.clone({
        //         setHeaders: {
        //            Authorization: `Bearer ${token}`
        //         }
        //     });
        // }
        // return next.handle(request);
    }
}
