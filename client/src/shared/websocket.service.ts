import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://192.168.1.18:2000';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket = socketIo(SERVER_URL);


  public send(type: string, data?: any): void {
    console.log('sending', type, data);
    this.socket.emit(type, data);
  }

  public onEvent(type: string): Observable<any> {
    return Observable.create(observer => {
      this.socket.on(type, data => {
        console.log('RECEIVED', type);
        // console.log(data);
        observer.next(data);
      });
    });
  }
}
