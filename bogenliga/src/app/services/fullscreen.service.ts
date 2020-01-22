import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FullscreenService {

  constructor() { }

  private emitChangeSource = new Subject<boolean>();
  changeEmitted$ = this.emitChangeSource.asObservable();

  emitChange(change: boolean) {
      this.emitChangeSource.next(change);
  }

}
