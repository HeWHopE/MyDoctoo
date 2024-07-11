import type { IFavorite } from '../../dataTypes/Favorite';
import { createAppSlice } from '../createAppSlice';
import type { RootState } from '../store';

type FavoriteData = {
  data: IFavorite[];
};

const initialState: FavoriteData = {
  data: [],
};

export const favoriteSlice = createAppSlice({
  name: 'favorite',
  initialState,
  reducers: {
    setFavorite: (state, action) => {
      state.data = action.payload;
    },

    setNewFavorite: (state, action) => {
      state.data = [...state.data, action.payload];
    },

    deleteFavorite: (state, action) => {
      state.data = state.data.filter(item => item.id !== action.payload);
    },
  },
});

export const { setFavorite, deleteFavorite, setNewFavorite } = favoriteSlice.actions;

export const DeclarationData = (state: RootState) => state.favorite.data;

export default favoriteSlice.reducer;
