import type { RootState } from '@/app/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IReview } from '@/dataTypes/Review';
import { createAppSlice } from '../createAppSlice';

interface ReviewData {
  reviews: IReview[];
}

const initialState: ReviewData = {
  reviews: [],
};

export const reviewSlice = createAppSlice({
  name: 'review',
  initialState,
  reducers: {
    setReviews: (state, action: PayloadAction<IReview[]>) => {
      state.reviews = action.payload;
    },

    updateReview: (state, action: PayloadAction<IReview>) => {
      const index = state.reviews.findIndex(review => review.id === action.payload.id);
      state.reviews[index] = action.payload;
    },

    deleteReview: (state, action: PayloadAction<string>) => {
      state.reviews = state.reviews.filter(review => review.id !== action.payload);
    },

    setNewReview: (state, action: PayloadAction<IReview>) => {
      state.reviews.push(action.payload);
    },
  },
});

export const { setReviews, deleteReview, setNewReview, updateReview } = reviewSlice.actions;

export const reviews = (state: RootState) => state.review.reviews;

export default reviewSlice.reducer;
