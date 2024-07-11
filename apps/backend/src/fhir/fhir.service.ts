import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CreateFhirDto } from './dto/create-fhir.dto';
@Injectable()
export class FhirService {
  constructor(private httpService: HttpService) {}

  fetchPatient(patientId: string, body: CreateFhirDto): Observable<AxiosResponse<any>> {
    const patientLionics = [encodeURIComponent('http://loinc.org|2106-3')];
    const url = `${body.serverUrl}/Patient?patient=${patientId}&limit=50&code=${patientLionics}`;

    try {
      return this.httpService
        .get(url, {
          headers: {
            Accept: 'application/fhir+json',
            Authorization: `Bearer ${body.token}`,
          },
        })
        .pipe(
          map(response => response.data),
          catchError(error =>
            throwError(
              () =>
                new BadRequestException(
                  `Failed to fetch patient data: ${error?.response?.statusText || error.message}`,
                ),
            ),
          ),
        );
    } catch (error) {
      return error;
    }
  }

  fetchObservation(patientId, body: CreateFhirDto): Observable<any> {
    const queryParams = new URLSearchParams({
      patient: patientId,
      subject: patientId,
      category: 'vital-signs',
      code: '29463-7',
      date: '2021-01-01',
    }).toString();

    const url = `${body.serverUrl}/Observation?${queryParams}`;
    try {
      return this.httpService
        .get(url, {
          headers: {
            Accept: 'application/fhir+json',
            Authorization: `Bearer ${body.token}`,
          },
        })
        .pipe(
          map(response => response.data),
          catchError(error =>
            throwError(
              () =>
                new BadRequestException(
                  `Failed to fetch patient data: ${error?.response?.statusText || error.message}`,
                ),
            ),
          ),
        );
    } catch (error) {
      return error;
    }
  }
}
