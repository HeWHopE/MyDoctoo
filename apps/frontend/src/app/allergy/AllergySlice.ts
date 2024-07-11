import { createAppSlice } from '../createAppSlice';
import type { TAllergy } from '@/dataTypes/Allergy';
import type { RootState } from '../store';

type AllergyData = {
  data: TAllergy[];
};

const initialState: AllergyData = {
  data: [],
};

export const allergySlice = createAppSlice({
  name: 'allergy',
  initialState,
  reducers: {
    setAllergyData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setAllergyData } = allergySlice.actions;

export const allergyData = (state: RootState) => state.allergy.data;

export default allergySlice.reducer;
