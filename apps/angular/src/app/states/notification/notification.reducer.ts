import { createReducer, on } from '@ngrx/store';
import * as NotificationActions from './notification.actions';
import { INotification } from '../../data-types/notification-types';

export interface NotificationState {
  notifications: INotification[];
  totalCount: number;
  loading: boolean;
  error: string | null | unknown;
}

const initialState: NotificationState = {
  notifications: [],
  totalCount: 0,
  loading: false,
  error: null,
};

export const notificationReducer = createReducer(
  initialState,
  on(NotificationActions.loadNotifications, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(NotificationActions.loadNotificationsSuccess, (state, { response }) => ({
    ...state,
    notifications: response.notifications,
    totalCount: response.totalCount,
    loading: false,
    error: null,
  })),
  on(NotificationActions.loadNotificationsFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
  }))
);
