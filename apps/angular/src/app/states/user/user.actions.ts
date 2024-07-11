import { createAction, props } from '@ngrx/store';
import { User } from '../../data-types/user-types';

export const getAuthData = createAction('[Auth] Get Auth Data', props<{ user: User | null }>());

export const getAuthorizationDataSuccess = createAction(
  '[Auth] Get Authorization Data Success',
  props<{ user: User }>()
);

export const getAuthorizationDataFailure = createAction(
  '[Auth] Get Authorization Data Failure',
  props<{ error: unknown }>()
);
