// /winner
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../util/getToken";
import { WinnerType } from "../_types/winner_type";

const baseUrl = import.meta.env.VITE_API_URL;

export const winnerApi = createApi({
  reducerPath: "winnerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}winner`,
    prepareHeaders: async (headers) => {
      const token = await getToken();
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["winner"],
  endpoints: (builder) => ({
    getAllWinners: builder.query<WinnerType[], void>({
      query: () => ({
        url: `/`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) =>
        response.success
          ? (response.data as WinnerType[])
          : ([] as WinnerType[]),
      providesTags: ["winner"],
    }),
    addNewWinner: builder.mutation({
      query: ({
        data,
      }: {
        data: { supplayerId: number; purchasedOrderId: number };
      }) => ({
        url: `/`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["winner"],
      transformErrorResponse: (response: any) => {
        console.error(response);
        return {
          message:
            response.data.message ||
            "An error occurred while adding a new winner",
          status: response.status,
        };
      },
    }),
    deleteWinner: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["winner"],
      transformErrorResponse: (response: any) => {
        console.error(response);
        return {
          message:
            response.data.message ||
            "An error occurred while deleting the winner",
          status: response.status,
        };
      },
    }),
    updateWinner: builder.mutation({
      query: ({ body, params }: { body: any; params: { id: number } }) => ({
        url: `/${params.id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      }),
      invalidatesTags: ["winner"],
      transformErrorResponse: (response: any) => {
        console.error(response);
        return {
          message:
            response.data.message ||
            "An error occurred while updating the winner",
          status: response.status,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllWinnersQuery,
  useAddNewWinnerMutation,
  useDeleteWinnerMutation,
  useUpdateWinnerMutation,
} = winnerApi;
