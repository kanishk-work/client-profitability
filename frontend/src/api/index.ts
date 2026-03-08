import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";
import type {
  Role,
  Client,
  ClientMonthlyRevenue,
  TimeEntry,
  ProfitabilityRow,
  RoleBreakdown,
} from "../types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Roles", "Clients", "Revenue", "TimeEntries", "Profitability"],
  endpoints: (builder) => ({
    // Roles
    getRoles: builder.query<Role[], void>({
      query: () => ({ url: "/roles" }),
      providesTags: ["Roles"],
    }),
    createRole: builder.mutation<Role, Partial<Role>>({
      query: (data) => ({ url: "/roles", method: "POST", data }),
      invalidatesTags: ["Roles"],
    }),
    deleteRole: builder.mutation<void, number>({
      query: (id) => ({ url: `/roles/${id}`, method: "DELETE" }),
      invalidatesTags: ["Roles"],
    }),

    // Clients
    getClients: builder.query<Client[], void>({
      query: () => ({ url: "/clients" }),
      providesTags: ["Clients"],
    }),
    createClient: builder.mutation<Client, Partial<Client>>({
      query: (data) => ({ url: "/clients", method: "POST", data }),
      invalidatesTags: ["Clients"],
    }),
    deleteClient: builder.mutation<void, number>({
      query: (id) => ({ url: `/clients/${id}`, method: "DELETE" }),
      invalidatesTags: ["Clients"],
    }),

    // Revenue
    getRevenue: builder.query<ClientMonthlyRevenue[], void>({
      query: () => ({ url: "/revenue" }),
      providesTags: ["Revenue"],
    }),
    setRevenue: builder.mutation<
      ClientMonthlyRevenue,
      Partial<ClientMonthlyRevenue>
    >({
      query: (data) => ({ url: "/revenue", method: "POST", data }),
      invalidatesTags: ["Revenue", "Profitability"],
    }),

    // Time Entries
    getTimeEntries: builder.query<
      TimeEntry[],
      { client_id?: number; month?: string }
    >({
      query: (params) => ({ url: "/time-entries", params }),
      providesTags: ["TimeEntries"],
    }),
    createTimeEntry: builder.mutation<TimeEntry, Partial<TimeEntry>>({
      query: (data) => ({ url: "/time-entries", method: "POST", data }),
      invalidatesTags: ["TimeEntries", "Profitability"],
    }),
    deleteTimeEntry: builder.mutation<void, number>({
      query: (id) => ({ url: `/time-entries/${id}`, method: "DELETE" }),
      invalidatesTags: ["TimeEntries", "Profitability"],
    }),

    // Profitability
    getProfitability: builder.query<ProfitabilityRow[], string>({
      query: (month) => ({ url: "/profitability", params: { month } }),
      providesTags: ["Profitability"],
    }),
    getClientProfitability: builder.query<
      RoleBreakdown[],
      { clientId: number; month: string }
    >({
      query: ({ clientId, month }) => ({
        url: `/profitability/${clientId}`,
        params: { month },
      }),
      providesTags: ["Profitability"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetClientsQuery,
  useCreateClientMutation,
  useDeleteClientMutation,
  useGetRevenueQuery,
  useSetRevenueMutation,
  useGetTimeEntriesQuery,
  useCreateTimeEntryMutation,
  useDeleteTimeEntryMutation,
  useGetProfitabilityQuery,
  useGetClientProfitabilityQuery,
} = api;
