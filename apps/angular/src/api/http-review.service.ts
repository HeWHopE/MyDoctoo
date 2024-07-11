import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IReview } from '../app/data-types/review-types';

@Injectable({
  providedIn: 'root',
})
export class HttpReviewService {
  constructor(private http: HttpClient) {}

  getReviewsByDoctorId(doctorId: string, includeNames: string, skip: string, take: string) {
    const res = this.http.get<IReview[]>('/review/doctor/' + doctorId, {
      params: { includeNames: includeNames, skip: skip, take: take },
    });
    return res;
  }
}
