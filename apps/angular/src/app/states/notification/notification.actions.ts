import { createAction, props } from '@ngrx/store';
import { NotificationResponse } from '../../data-types/notification-types';

export const loadNotifications = createAction(
  '[Notification] Load Notifications',
  props<{ page?: number; limit?: number; filter?: string }>()
);

export const loadNotificationsSuccess = createAction(
  '[Notification] Load Notifications Success',
  props<{ response: NotificationResponse }>()
);

export const loadNotificationsFailure = createAction(
  '[Notification] Load Notifications Failure',
  props<{ error: unknown }>()
);
