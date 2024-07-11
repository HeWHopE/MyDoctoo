import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpNotificationService } from '../../../api/http-notification.service';
import * as NotificationActions from './notification.actions';

@Injectable()
export class NotificationEffects {
  constructor(
    private actions$: Actions,
    private notificationService: HttpNotificationService
  ) {}

  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.loadNotifications),
      mergeMap(action =>
        this.notificationService.getNotificationsForPatient(action.page, action.limit, action.filter).pipe(
          map(response =>
            NotificationActions.loadNotificationsSuccess({
              response,
            })
          ),
          catchError(error =>
            of(
              NotificationActions.loadNotificationsFailure({
                error,
              })
            )
          )
        )
      )
    )
  );
}
