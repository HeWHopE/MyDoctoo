import { createAsyncThunk } from '@reduxjs/toolkit';
import type { ICreateUpdateReview, IReview } from '@/dataTypes/Review';
import { setNewReview, setReviews } from './ReviewSlice';
import { instance } from '@/api/axios.api';
import handleError from '@/api/handleError.api';

export const fetchReviewsByDoctor = createAsyncThunk(
  'reviews/fetch',
  async (
    { doctorId, includeNames, skip, take }: { doctorId: string; includeNames: string; skip?: string; take?: string },
    { dispatch },
  ) => {
    try {
      const response = await instance.get(`/review/doctor/${doctorId}`, {
        params: {
          includeNames: includeNames,
          skip: skip,
          take: take,
        },
      });
      if (response.status === 200) {
        dispatch(setReviews(response.data));
      }
    } catch (e) {
      handleError(e as Error);
    }
  },
);

export const createReview = createAsyncThunk(
  'reviews/create',
  async ({ review, doctorId }: { review: ICreateUpdateReview; doctorId: string }, { dispatch }) => {
    try {
      const response = await instance.post(`/review/doctor/${doctorId}`, review);
      if (response.status === 201) {
        dispatch(setNewReview(response.data));
        return response.data;
      }
    } catch (e) {
      handleError(e as Error);
    }
  },
);

export const updateReview = createAsyncThunk('reviews/update', async (review: IReview, { dispatch }) => {
  try {
    const response = await instance.patch(`/review/${review.id}`, review);
    if (response.status === 200) {
      dispatch(updateReview(response.data));
      return response.data;
    }
  } catch (e) {
    handleError(e as Error);
  }
});

export const deleteReview = createAsyncThunk('reviews/delete', async (id: string, { dispatch }) => {
  try {
    const response = await instance.delete(`/review/${id}`);
    if (response.status === 204) {
      dispatch(deleteReview(id));
    }
  } catch (e) {
    handleError(e as Error);
  }
});
