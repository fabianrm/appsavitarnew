import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor() { }

  isLoading$ = new Subject<boolean>();


  show(): void {
    //Retrasamos en 1 milisegundo para evitar el error de checkdetection
    setTimeout(() => this.isLoading$.next(true), 10)
    //this.isLoading$.next(true);

    /* of(false).pipe(delay(5)).subscribe(()=>{
        this.isLoading$.next(true)
    })*/
  }

  hide(): void {
    this.isLoading$.next(false)

    //Si desea retrasar el tiempo que se muestra el spinner
    /*of(false).pipe(delay(300)).subscribe((res:any)=>{
        this.isLoading$.next(false)
    })*/
    //setTimeout(() => this.isLoading$.next(false), 300)
  }
}
