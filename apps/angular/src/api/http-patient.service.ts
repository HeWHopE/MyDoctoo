import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPatient } from '../app/data-types/patient-types';

@Injectable({
  providedIn: 'root',
})
export class HttpPatientService {
  constructor(private http: HttpClient) {}

  getPatientById(patientId: string) {
    const res = this.http.get<IPatient>('/patient/' + patientId);
    return res;
  }
}
