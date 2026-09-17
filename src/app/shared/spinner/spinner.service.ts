import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor() { }

  isLoading$ = new BehaviorSubject<boolean>(false);

  private requestCount = 0;

  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.isLoading$.next(true);
    }
  }

  hide(): void {
    if (this.requestCount > 0) {
      this.requestCount--;
    }
    if (this.requestCount === 0) {
      this.isLoading$.next(false);
    }
  }
}
