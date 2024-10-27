import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../util/getToken";
import {
  StoreInventoryActionType,
  StoreInventoryStoke,
  StoreInventoryType,
} from "../_types/store_inventory";
import extractErrorMessage from "../util/extractErrorMessage"; // Assuming you have this utility

const baseUrl = import.meta.env.VITE_API_URL;

export const storeInventoryApi = createApi({
  reducerPath: "storeInventoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}storeInventory`,
    prepareHeaders: async (headers) => {
      const token = await getToken();
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["store_inventory"],
  endpoints: (builder) => ({
    getAllStoresInventory: builder.query<StoreInventoryType[], void>({
      query: () => ({
        url: `/`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) => {
        console.log(response);
        return response.success
          ? (response.data as StoreInventoryType[])
          : ([] as StoreInventoryType[]);
      },
      providesTags: ["store_inventory"],
      transformErrorResponse: (response: any) => {
        const message = response?.data?.message || "Unknown error";
        return extractErrorMessage(message);
      },
    }),
    getAllStoresInventoryStoke: builder.query<StoreInventoryStoke[], void>({
      query: () => ({
        url: `/stoke`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any) => {
        console.log(response);
        return response.success
          ? (response.data as StoreInventoryStoke[])
          : ([] as StoreInventoryStoke[]);
      },
      providesTags: ["store_inventory"],
      transformErrorResponse: (response: any) => {
        const message = response?.data?.message || "Unknown error";
        return extractErrorMessage(message);
      },
    }),
    //

    addNewStoreInventory: builder.mutation({
      query: ({
        data,
      }: {
        data: {
          storId: number;
          productId: number;
          quantity: number;
          type: StoreInventoryActionType;
        };
      }) => ({
        url: `/`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["store_inventory"],
      transformErrorResponse: (response: any) => {
        const message = response?.data?.message || "Failed to add inventory";
        return extractErrorMessage(message);
      },
    }),

    deleteStoreInventory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["store_inventory"],
      transformErrorResponse: (response: any) => {
        const message = response?.data?.message || "Failed to delete inventory";
        return extractErrorMessage(message);
      },
    }),

    updateStoreInventory: builder.mutation<
      void,
      { body: Partial<StoreInventoryType>; params: { id: number } }
    >({
      query: ({ body, params }) => ({
        url: `/${params.id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      }),
      invalidatesTags: ["store_inventory"],
      transformErrorResponse: (response: any) => {
        const message = response?.data?.message || "Failed to update inventory";
        return extractErrorMessage(message);
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useAddNewStoreInventoryMutation,
  useDeleteStoreInventoryMutation,
  useGetAllStoresInventoryQuery,
  useUpdateStoreInventoryMutation,
  useGetAllStoresInventoryStokeQuery,
} = storeInventoryApi;
