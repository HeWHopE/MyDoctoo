import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationState } from './notification.reducer';

const selectNotificationState = createFeatureSelector<NotificationState>('notifications');

export const selectNotifications = createSelector(
  selectNotificationState,
  (state: NotificationState) => state.notifications
);

export const selectTotalCount = createSelector(selectNotificationState, (state: NotificationState) => state.totalCount);

export const selectLoading = createSelector(selectNotificationState, (state: NotificationState) => state.loading);

export const selectError = createSelector(selectNotificationState, (state: NotificationState) => state.error);
