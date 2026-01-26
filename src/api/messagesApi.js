import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3030' }),
  tagTypes: ['Messages'],
  endpoints: (builder) => ({
    // GET /messages
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: ['Messages'],
    }),

    // POST /messages
    sendMessage: builder.mutation({
      query: (newMessage) => ({
        url: '/messages',
        method: 'POST',
        body: newMessage,
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = messagesApi;
