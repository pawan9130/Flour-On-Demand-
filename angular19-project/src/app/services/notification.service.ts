import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _unread = new BehaviorSubject<number>(2);
  public unreadCount$ = this._unread.asObservable();

  markAllRead() { this._unread.next(0); }
  pushNotification() { this._unread.next(this._unread.value + 1); }
}
