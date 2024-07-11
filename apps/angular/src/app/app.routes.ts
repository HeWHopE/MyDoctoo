import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'appointments',
    loadComponent: () =>
      import('./pages/appointments-page/appointments-page.component').then(mod => mod.AppointmentsPageComponent),
  },
  {
    path: 'reviews/:doctorId',
    loadComponent: () => import('./pages/reviews-page/reviews-page.component').then(mod => mod.ReviewsPageComponent),
  },
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar-page/calendar-page.component').then(mod => mod.CalendarPageComponent),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./pages/notification-page/notification-page.component').then(mod => mod.NotificationPageComponent),
  },
];
