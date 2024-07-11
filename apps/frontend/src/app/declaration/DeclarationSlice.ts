import type { IDeclaration } from '../../dataTypes/Declaration';
import { createAppSlice } from '../createAppSlice';
import type { RootState } from '../store';

type DeclarationData = {
  data: IDeclaration[];
};

const initialState: DeclarationData = {
  data: [],
};

export const declarationSlice = createAppSlice({
  name: 'declaration',
  initialState,
  reducers: {
    setDeclaration: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setDeclaration } = declarationSlice.actions;

export const DeclarationData = (state: RootState) => state.declaration.data;

export default declarationSlice.reducer;
