import type { IHospital } from '../../dataTypes/Hospital';
import { createAppSlice } from '../createAppSlice';
import type { RootState } from '../store';

type HospitalData = {
  data: IHospital[];
};

const initialState: HospitalData = {
  data: [],
};

export const hospitalSlice = createAppSlice({
  name: 'declaration',
  initialState,
  reducers: {
    setHospital: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setHospital } = hospitalSlice.actions;

export const DeclarationData = (state: RootState) => state.hospital.data;

export default hospitalSlice.reducer;
