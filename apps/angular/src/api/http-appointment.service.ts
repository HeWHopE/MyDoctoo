import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppointment } from '../app/data-types/appointment-types';

@Injectable({
  providedIn: 'root',
})
export class HttpAppointmentService {
  constructor(private http: HttpClient) {}

  getAllAppointments() {
    return this.http.get<IAppointment[]>('/appointment');
  }
}
