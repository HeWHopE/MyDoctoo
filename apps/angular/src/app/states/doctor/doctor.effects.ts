import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetchAllDoctors, fetchAllDoctorsSuccess, fetchDoctorById, fetchDoctorByIdSuccess } from './doctor.actions';
import { map, mergeMap } from 'rxjs/operators';
import { HttpDoctorService } from '../../../api/http-doctor.service';

@Injectable()
export class DoctorEffects {
  fetchAllDoctors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchAllDoctors),
      mergeMap(() => this.doctorService.getAllDoctors().pipe(map(doctors => fetchAllDoctorsSuccess({ doctors }))))
    )
  );

  fetchDoctorById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchDoctorById),
      mergeMap(action =>
        this.doctorService.getDoctorById(action.doctorId).pipe(map(doctor => fetchDoctorByIdSuccess({ doctor })))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private doctorService: HttpDoctorService
  ) {}
}
