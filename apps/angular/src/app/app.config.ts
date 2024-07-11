import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app.routes';
import { apiInterceptorProvider } from '../api/apiInterceptorProvider';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ReviewEffects } from './states/review/review.effects';
import { reviewReducer } from './states/review/review.reducer';
import { doctorReducer } from './states/doctor/doctor.reducer';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { patientReducer } from './states/patient/patient.reducer';
import { DoctorEffects } from './states/doctor/doctor.effects';
import { PatientEffects } from './states/patient/patient.effects';
import { notificationReducer } from './states/notification/notification.reducer';
import { NotificationEffects } from './states/notification/notification.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      StoreModule.forRoot({
        reviews: reviewReducer,
        doctors: doctorReducer,
        patients: patientReducer,
        notifications: notificationReducer,
      }),
      StoreDevtoolsModule.instrument(),
      StoreRouterConnectingModule.forRoot(),
      EffectsModule.forRoot([ReviewEffects, DoctorEffects, PatientEffects, NotificationEffects])
    ),
    apiInterceptorProvider,
    provideAnimationsAsync(),
  ],
};
