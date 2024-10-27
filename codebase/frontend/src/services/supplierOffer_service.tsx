import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../util/getToken";
import extractErrorMessage from "../util/extractErrorMessage";
import {
  SupplierOffer,
  SupplierOfferRequest,
} from "../_types/supplierOffer_type";

const baseUrl = import.meta.env.VITE_API_URL;

export const supplierOfferApi = createApi({
  reducerPath: "supplierOfferApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}supplierOffer`,
    prepareHeaders: async (headers) => {
      const token = await getToken();
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["SupplierOffer"],
  endpoints: (builder) => ({
    getAllSupplierOfferApi: builder.query<SupplierOffer[], void>({
      query: () => ({
        url: `/`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) => {
        console.log(response.data);
        return response.success ? (response.data as SupplierOffer[]) : [];
      },
      providesTags: ["SupplierOffer"],
      transformErrorResponse: (response: any) => {
        const message = response?.data?.message || "Unknown error";
        return extractErrorMessage(message);
      },
    }),
    getAllSupplierOfferApiByPo: builder.query({
      query: ({ params }: { params: { purchasedOrderId: number } }) => ({
        url: `/po/${params.purchasedOrderId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) => {
        console.log(response.data);
        return response.success ? (response.data as SupplierOffer[]) : [];
      },
      providesTags: ["SupplierOffer"],
      transformErrorResponse: (response: any) => {
        console.log(response);
        const message = response?.data?.message || "Unknown error";
        return extractErrorMessage(message);
      },
    }),
    getSingleSupplierOfferApi: builder.query<SupplierOffer, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) => {
        return response.data as SupplierOffer;
      },
      providesTags: ["SupplierOffer"],
      transformErrorResponse: (response: any) => {
        const message = response?.data?.message || "Unknown error";
        return extractErrorMessage(message);
      },
    }),
    getSingleSupplierOfferBySupplayerIdApi: builder.query({
      query: ({
        params,
      }: {
        params: { purchasedOrderId: number; supplierId: number };
      }) => ({
        url: `/${params.purchasedOrderId}/${params.supplierId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) => {
        return response.data as SupplierOffer;
      },
      providesTags: ["SupplierOffer"],
      transformErrorResponse: (response: any) => {
        const message = response?.data?.message || "Unknown error";
        return extractErrorMessage(message);
      },
    }),
    getSingleSupplierOfferByIdApi: builder.query<
      SupplierOffer,
      { params: number }
    >({
      query: ({ params }) => ({
        url: `/purchased/order/offer/${params}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) => {
        return response.data as SupplierOffer;
      },
      providesTags: ["SupplierOffer"],
      transformErrorResponse: (response: any) => {
        const message = response?.data?.message || "Unknown error";
        return extractErrorMessage(message);
      },
    }),
    addNewSupplierOfferApi: builder.mutation<void, SupplierOfferRequest>({
      query: (data) => ({
        url: `/`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["SupplierOffer"],
      transformErrorResponse: (response: any) => {
        console.log(response);
        const message = response?.data?.message || "Unknown error";
        return extractErrorMessage(message);
      },
    }),
    deleteSupplierOfferApi: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["SupplierOffer"],
      transformErrorResponse: (response: any) => {
        console.log("Delete error response:", response);
        try {
          const message =
            response?.data?.message || "Error occurred while deleting";
          return extractErrorMessage(message);
        } catch (error) {
          console.error("Error in transformErrorResponse:", error);
          return "An unexpected error occurred while processing your request.";
        }
      },
    }),
  }),
});

export const {
  useGetAllSupplierOfferApiQuery,
  useGetAllSupplierOfferApiByPoQuery,
  useGetSingleSupplierOfferApiQuery,
  useAddNewSupplierOfferApiMutation,
  useDeleteSupplierOfferApiMutation,
  useGetSingleSupplierOfferByIdApiQuery,
} = supplierOfferApi;
