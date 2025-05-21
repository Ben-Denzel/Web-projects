import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor() {}

  notify(message: string) {
    if (Notification.permission === 'granted') {
      new Notification('Task Manager', { body: message });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Task Manager', { body: message });
        }
      });
    }
  }
}
