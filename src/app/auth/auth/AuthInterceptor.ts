import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../app-config.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private configService: AppConfigService){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const authToken = localStorage.getItem('token');
        const externalToken = '69b635947d4d68d2abe563031f29926a4a20bcc4f44db20d9cf028320bf4cfad';
        const clientId = this.configService.getClientId(); 

        // Verifica si la URL es del endpoint externo
        if (request.url.includes('https://apiperu.dev/api')) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${externalToken}`
                }
            });
        } else if (authToken) {
            console.log('Cliente ID logueado: ', clientId);
            console.log('Token: ', authToken);
            
            // Aplica el token de autenticación predeterminado
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${authToken}`,
                    'X-Client-ID': clientId
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
