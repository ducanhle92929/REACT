import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://10.0.2.2:3000',
  }),
  endpoints: (builder) => ({
    // Mutation để đăng ký (signup)
    signup: builder.mutation({
      query: (userData) => ({
        url: '/user',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

// Hook signup mutation
export const { useSignupMutation } = authApi;
