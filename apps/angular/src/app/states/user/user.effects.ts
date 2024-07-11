import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpAuthService } from '../../../api/http-auth.service';
import * as AuthActions from './user.actions';
import { User } from '../../data-types/user-types';

export class UserEffects {
  constructor(
    private actions$: Actions,
    private authService: HttpAuthService
  ) {}

  getUserFromAuthData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getAuthData),
      switchMap(() =>
        this.authService.getAuthorizationData().pipe(
          map((user: User) => AuthActions.getAuthorizationDataSuccess({ user })),
          catchError(error => of(AuthActions.getAuthorizationDataFailure({ error })))
        )
      )
    )
  );
}
