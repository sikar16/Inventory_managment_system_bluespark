import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MaterialRequest_type } from "../_types/materialReq_type";
import { getToken } from "../util/getToken";
import extractErrorMessage from "../util/extractErrorMessage";

const baseUrl = import.meta.env.VITE_API_URL;

export const materialReqApi = createApi({
  reducerPath: "materialReqApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}materialReq`,
    prepareHeaders: async (headers) => {
      const token = await getToken();
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["MaterialReq"], // For invalidating and refetching data
  endpoints: (builder) => ({
    // Fetch all material requests
    getAllMaterialReq: builder.query<MaterialRequest_type[], void>({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["MaterialReq"],
      transformErrorResponse: (response: any) =>
        extractErrorMessage(response?.data?.message || "Unknown error"),
    }),

    // Fetch all personal material requests
    getAllMyMaterialReq: builder.query<MaterialRequest_type[], void>({
      query: () => ({
        url: `/my`,
        method: "GET",
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["MaterialReq"],
      transformErrorResponse: (response: any) =>
        extractErrorMessage(response?.data?.message || "Unknown error"),
    }),

    // Fetch material requests by department head
    getAllMaterialReqByDepartmentHead: builder.query<
      MaterialRequest_type[],
      void
    >({
      query: () => ({
        url: `/departmenthead`,
        method: "GET",
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["MaterialReq"],
      transformErrorResponse: (response: any) =>
        extractErrorMessage(response?.data?.message || "Unknown error"),
    }),

    // Fetch material requests by logistic supervisor (LS)
    getAllMaterialReqByLs: builder.query<MaterialRequest_type[], void>({
      query: () => ({
        url: `/ls`,
        method: "GET",
      }),
      transformResponse: (response: any) =>
        response.success ? response.data : [],
      providesTags: ["MaterialReq"],
      transformErrorResponse: (response: any) =>
        extractErrorMessage(response?.data?.message || "Unknown error"),
    }),

    // Fetch a single material request by ID
    getSingleMaterialReq: builder.query<MaterialRequest_type, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["MaterialReq"],
      transformErrorResponse: (response: any) =>
        extractErrorMessage(response?.data?.message || "Unknown error"),
    }),

    // Add a new material request
    addNewMaterialReq: builder.mutation<void, { items: any }>({
      query: (data) => ({
        url: `/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MaterialReq"], // Triggers refetch after the mutation
      transformErrorResponse: (response: any) =>
        extractErrorMessage(response?.data?.message || "Unknown error"),
    }),

    // Delete a material request
    deleteMaterialReq: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MaterialReq"], // Triggers refetch after the deletion
      transformErrorResponse: (response: any) =>
        extractErrorMessage(
          response?.data?.message || "Error deleting request"
        ),
    }),

    // Approve a material request
    approveReq: builder.mutation<
      void,
      {
        body: { isApproviedByDH: boolean; logisticSuperViserId: number | null };
        param: number;
      }
    >({
      query: ({ body, param }) => ({
        url: `/approve/${param}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MaterialReq"], // Triggers refetch after approval
      transformResponse: (response: any) =>
        response.success ? response.message : "Something happened",
      transformErrorResponse: (response: any) =>
        extractErrorMessage(response?.data?.message || "Unknown error"),
    }),
  }),
});

export const {
  useGetAllMaterialReqQuery,
  useGetAllMyMaterialReqQuery,
  useGetAllMaterialReqByDepartmentHeadQuery,
  useGetAllMaterialReqByLsQuery,
  useGetSingleMaterialReqQuery,
  useAddNewMaterialReqMutation,
  useDeleteMaterialReqMutation,
  useApproveReqMutation,
} = materialReqApi;
