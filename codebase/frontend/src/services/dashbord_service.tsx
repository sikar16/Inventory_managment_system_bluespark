import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../util/getToken";

const baseUrl = import.meta.env.VITE_API_URL;

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}dashboard`,
    prepareHeaders: async (headers) => {
      const token = await getToken();
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getMonthlyMaterialRequestStats: builder.query({
      query: () => ({
        url: `/getMonthlyMaterialRequestStats`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["Dashboard"],
    }),
    getMonthlyPurchaseRequestStats: builder.query({
      query: () => ({
        url: `/getMonthlyPurchaseRequestStats`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["Dashboard"],
    }),
    getMonthlyPurchaseOrderStats: builder.query({
      query: () => ({
        url: `/getMonthlyPurchaseOrderStats`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["Dashboard"],
    }),
    getMonthlyInventoryStats: builder.query({
      query: () => ({
        url: `/getMonthlyInventoryStats`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["Dashboard"],
    }),
    getEmployeeType: builder.query({
      query: () => ({
        url: `/employeeType`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["Dashboard"],
    }),
    getUserStatusType: builder.query({
      query: () => ({
        url: `/userStatusType`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["Dashboard"],
    }),
    getDepartmentType: builder.query({
      query: () => ({
        url: `/departmentType`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["Dashboard"],
    }),
    getSupplierType: builder.query({
      query: () => ({
        url: `/supplierType`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["Dashboard"],
    }),
    getMaterialRequest: builder.query({
      query: () => ({
        url: `/materialRequest`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["Dashboard"],
    }),
    getPurchaseOrder: builder.query({
      query: () => ({
        url: `/purchaseOrder`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["Dashboard"],
    }),
    financeTotalPrice: builder.query({
      query: () => ({
        url: `/financeTotalPrice`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["Dashboard"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLazyGetMonthlyMaterialRequestStatsQuery,
  useLazyGetMonthlyPurchaseRequestStatsQuery,
  useLazyGetMonthlyPurchaseOrderStatsQuery,
  useLazyGetMonthlyInventoryStatsQuery,
  useLazyGetEmployeeTypeQuery,
  useLazyGetUserStatusTypeQuery,
  useLazyGetDepartmentTypeQuery,
  useLazyGetSupplierTypeQuery,
  useLazyGetMaterialRequestQuery,
  useLazyGetPurchaseOrderQuery,
  useLazyFinanceTotalPriceQuery,
} = dashboardApi;
