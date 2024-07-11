import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetchPatient, fetchPatientSuccess } from './patient.actions';
import { map, mergeMap } from 'rxjs/operators';
import { HttpPatientService } from '../../../api/http-patient.service';

@Injectable()
export class PatientEffects {
  fetchPatientById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchPatient),
      mergeMap(action =>
        this.patientService
          .getPatientById(action.patientId)
          .pipe(map(currentPatient => fetchPatientSuccess({ currentPatient })))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private patientService: HttpPatientService
  ) {}
}
