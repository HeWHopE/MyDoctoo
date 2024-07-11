import { createAppSlice } from '../createAppSlice';
import type { TCondition } from '@/dataTypes/Condition';
import type { RootState } from '../store';
import type { PayloadAction } from '@reduxjs/toolkit';

type ConditionData = {
  data: TCondition[];
};

const initialState: ConditionData = {
  data: [],
};

export const conditionSlice = createAppSlice({
  name: 'condition',
  initialState,
  reducers: {
    setConditionData: (state, action: PayloadAction<TCondition[]>) => {
      state.data = action.payload;
    },
    addCondition: (state, action: PayloadAction<TCondition>) => {
      state.data.push(action.payload);
    },
  },
});

export const { setConditionData, addCondition } = conditionSlice.actions;

export const conditionData = (data: RootState) => data.condition.data;

export default conditionSlice.reducer;
