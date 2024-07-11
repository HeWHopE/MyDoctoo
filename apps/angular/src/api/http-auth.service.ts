import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../app/data-types/user-types';

@Injectable({
  providedIn: 'root',
})
export class HttpAuthService {
  constructor(private http: HttpClient) {}

  getAuthorizationData(): Observable<User> {
    const url = `/auth/get/me`;
    return this.http.get<User>(url);
  }
}
