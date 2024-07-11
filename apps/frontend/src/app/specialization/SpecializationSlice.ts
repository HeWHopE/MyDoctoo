import type { RootState } from '@/app/store';
import { createAppSlice } from '../createAppSlice';
import type { Specialization } from '@/dataTypes/Doctor';
import { getSpecializationsList } from './SpecializationThunks';

export interface SpecializationData {
  specializations: Specialization[];
}

const initialState: SpecializationData = {
  specializations: [],
};

export const specializationSlice = createAppSlice({
  name: 'specialization',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder.addCase(getSpecializationsList.fulfilled, (state, action) => {
      state.specializations = action.payload;
    }),
});

export const specializationsList = (state: RootState) => state.specialization.specializations;

export default specializationSlice.reducer;
