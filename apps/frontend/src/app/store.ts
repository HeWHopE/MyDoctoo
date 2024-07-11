import { configureStore } from '@reduxjs/toolkit';
import { doctorSlice } from './doctor/DoctorSlice';
import { appointmentSlice } from './appointment/AppointmentSlice';
import { patientSlice } from './patient/PatientSlice';
import paymentSlice from './payment/paymentSlice';
import { allergySlice } from './allergy/AllergySlice';
import conditionSlice from './condition/ConditionSlice';
import reviewSlice from './review/ReviewSlice';
import { declarationSlice } from './declaration/DeclarationSlice';
import { hospitalSlice } from './hospital/HospitalSlice';
import { userSlice } from './user/UserSlice';
import { chatSlice } from './chat/ChatSlice';
import { specializationSlice } from './specialization/SpecializationSlice';
import { favoriteSlice } from './favorite/FavoriteSlice';
import assistantSlice from './assistant/AssistantSlice';

export const store = configureStore({
  reducer: {
    doctor: doctorSlice.reducer,
    appointment: appointmentSlice.reducer,
    patient: patientSlice.reducer,
    payment: paymentSlice,
    allergy: allergySlice.reducer,
    condition: conditionSlice,
    review: reviewSlice,
    declaration: declarationSlice.reducer,
    hospital: hospitalSlice.reducer,
    user: userSlice.reducer,
    chat: chatSlice.reducer,
    specialization: specializationSlice.reducer,
    favorite: favoriteSlice.reducer,
    assistant: assistantSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
