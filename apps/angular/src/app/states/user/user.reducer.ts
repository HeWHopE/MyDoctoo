import { createReducer, on } from '@ngrx/store';
import { getAuthorizationDataSuccess } from './user.actions';
import { User } from '../../data-types/user-types';

export interface UserState {
  user: User | null;
}

export const initialState: UserState = {
  user: null,
};

export const userReducer = createReducer(
  initialState,
  on(getAuthorizationDataSuccess, (state, { user }) => ({ ...state, user }))
);
