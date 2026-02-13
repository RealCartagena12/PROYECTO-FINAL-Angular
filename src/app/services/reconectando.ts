import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root',})
export class Reconectando {
    private _reconnecting$ = new BehaviorSubject<boolean>(false);
    reconnecting$ = this._reconnecting$.asObservable();

    setReconnecting(value: boolean) {
        this._reconnecting$.next(value);
    }
}
