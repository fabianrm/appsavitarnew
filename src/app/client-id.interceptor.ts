import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable()
export class ClientIdInterceptor implements HttpInterceptor {

  constructor(private configService: AppConfigService){}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clientId = this.configService.getClientId(); // Obtén el ID del cliente de alguna forma, por ejemplo, desde un servicio

    const clonedRequest = request.clone({
      setHeaders: {
        'X-Client-ID': clientId
      }
    });

    return next.handle(clonedRequest);
  }

  // private getClientId(): string {



  //   // Lógica para obtener el ID del cliente, podría ser estático o dinámico
  //   // Ejemplo: return 'client1';
  //   return 'client1'; // o 'client2', dependiendo del cliente
  // }
}

