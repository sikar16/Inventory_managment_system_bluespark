import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../util/getToken";
import { PurchasedRequest_type } from "../_types/purchasedReq_type";
import extractErrorMessage from "../util/extractErrorMessage";

const baseUrl = import.meta.env.VITE_API_URL;

export const purchasedReqApi = createApi({
  reducerPath: "purchasedReqApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}purchasedReq`,
    prepareHeaders: async (headers) => {
      const token = await getToken();
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["PurchasedReq"],
  endpoints: (builder) => ({
    getAllPurchasedReq: builder.query<PurchasedRequest_type[], void>({
      query: () => ({
        url: `/`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      transformResponse: (response: any) => {
        console.log("Response from API:", response); // Log the response
        return response.success
          ? (response.data as PurchasedRequest_type[])
          : [];
      },
      providesTags: ["PurchasedReq"],
    }),

    getAllPurchasedReqByManager: builder.query<PurchasedRequest_type[], void>({
      query: () => ({
        url: `/manager`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      transformResponse: (response: any) => {
        console.log("Response from API:", response); // Log the response
        return response.success
          ? (response.data as PurchasedRequest_type[])
          : [];
      },
      providesTags: ["PurchasedReq"],
    }),

    getSinglePurchasedReq: builder.query<PurchasedRequest_type, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      transformResponse: (response: any) =>
        response.data as PurchasedRequest_type,
      providesTags: (_result, _error, id) => [{ type: "PurchasedReq", id }],
    }),

    addNewpurchasedReq: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          materialRequestId: number;
          items: {
            productId: number;
            quantityToBePurchased: number;
            unitPrice: number;
          }[];
        };
      }) => ({
        url: `/create`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      }),
      transformErrorResponse: (response: any) => {
        console.log(response);
        return extractErrorMessage(response.data.message as string);
      },
      transformResponse: (response: any) => {
        console.log(response);
        return response;
      },
      invalidatesTags: ["PurchasedReq"],
    }),

    updatePurchasedReq: builder.mutation<
      void,
      { id: string; data: PurchasedRequest_type }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["PurchasedReq"],
    }),

    deletePurchasedReq: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }),
      transformErrorResponse: (response: any) => {
        console.log(response);
        return extractErrorMessage(response.data.message as string);
      },
      invalidatesTags: ["PurchasedReq"],
    }),

    approvePurchasedReq: builder.mutation({
      query: ({
        body,
        param,
      }: {
        body: { isApproviedByFinance: boolean };
        param: number;
      }) => ({
        url: `/approve/finance/${param}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PurchasedReq"],
      transformResponse: (response: any) =>
        response.success ? response.message : "Error",
    }),

    approvePurchasedReqGM: builder.mutation({
      query: ({
        body,
        param,
      }: {
        body: { isApproviedByGM: boolean };
        param: number;
      }) => ({
        url: `/approve/gm/${param}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PurchasedReq"],
      transformResponse: (response: any) =>
        response.success ? response.message : "Error",
    }),
  }),
});

export const {
  useGetAllPurchasedReqQuery,
  useGetAllPurchasedReqByManagerQuery,
  useGetSinglePurchasedReqQuery,
  useAddNewpurchasedReqMutation,
  useUpdatePurchasedReqMutation,
  useDeletePurchasedReqMutation,
  useApprovePurchasedReqMutation,
  useApprovePurchasedReqGMMutation,
} = purchasedReqApi;
