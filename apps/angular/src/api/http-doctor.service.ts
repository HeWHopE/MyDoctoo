import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDoctor } from '../app/data-types/doctor-types';

@Injectable({
  providedIn: 'root',
})
export class HttpDoctorService {
  constructor(private http: HttpClient) {}

  getAllDoctors() {
    const res = this.http.get<IDoctor[]>('/doctor');
    return res;
  }

  getDoctorById(doctorId: string) {
    const res = this.http.get<IDoctor>(`/doctor/${doctorId}`);
    return res;
  }
}
