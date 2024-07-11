import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationResponse } from '../app/data-types/notification-types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpNotificationService {
  constructor(private http: HttpClient) {}

  getNotificationsForPatient(
    page: number = 1,
    limit: number = 10,
    filter: string = 'all'
  ): Observable<NotificationResponse> {
    const params = {
      page: page,
      limit: limit,
      filter: filter,
    };

    const url = `/notification/my`;
    return this.http.get<NotificationResponse>(url, { params });
  }
}
