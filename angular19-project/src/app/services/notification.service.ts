import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  id: number;
  userId?: number;
  orderId?: string | number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _notifications = new BehaviorSubject<AppNotification[]>([]);
  public notifications$ = this._notifications.asObservable();
  private _unread = new BehaviorSubject<number>(0);
  public unreadCount$ = this._unread.asObservable();

  markAllRead() {
    const next = this._notifications.value.map(n => ({ ...n, isRead: true }));
    this._notifications.next(next);
    this._unread.next(0);
  }

  pushNotification(title: string, message: string, details: Partial<AppNotification> = {}) {
    const item: AppNotification = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      title,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
      ...details
    };
    const next = [item, ...this._notifications.value];
    this._notifications.next(next);
    this._unread.next(next.filter(n => !n.isRead).length);
    return item;
  }

  getNotifications() {
    return this._notifications.value;
  }
}
