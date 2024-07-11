import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileData } from '../app/data-types/notification-types';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  getFile(fileKey: string): Observable<FileData> {
    return this.http.get<FileData>(`/file/${fileKey}`);
  }
}
