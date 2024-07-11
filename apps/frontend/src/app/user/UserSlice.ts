import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';
import { type components } from '../../api';

interface UserData {
  data: {
    role?: components['schemas']['MeResponseDto']['role'];
    isPasswordExist?: boolean;
  };
  state: {
    isLoading: boolean;
    isFetched: boolean;
  };
}

const initialState: UserData = {
  state: {
    isLoading: false,
    isFetched: false,
  },
  data: {
    role: undefined,
    isPasswordExist: false,
  },
};

export const userSlice = createAppSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData['data']>) => {
      state.data = action.payload;
    },
    setUserState: (state, action: PayloadAction<Partial<UserData['state']>>) => {
      state.state = {
        ...state.state,
        ...action.payload,
      };
    },

    setUserPasswordExist: (state, action: PayloadAction<boolean>) => {
      state.data.isPasswordExist = action.payload;
    },
  },
});

export const { setUserData, setUserState, setUserPasswordExist } = userSlice.actions;

export default userSlice.reducer;
