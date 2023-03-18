import { size } from "lodash";
import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
      //   try {
      //     const response = await queryFulfilled;

      //     const result = {
      //       accessToken: response?.data?.accessToken,
      //       user: response?.data?.user,
      //     };

      //     if (size(result)) {
      //       localStorage.setItem("auth", JSON.stringify(result));
      //       dispatch(userLoggedIn(result));
      //     }
      //   } catch (err) {
      //     // nothing
      //   }
      // },
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
      //   try {
      //     const response = await queryFulfilled;

      //     const result = {
      //       accessToken: response?.data?.accessToken,
      //       user: response?.data?.user,
      //     };

      //     if (size(result)) {
      //       localStorage.setItem("auth", JSON.stringify(result));
      //       dispatch(userLoggedIn(result));
      //     }
      //   } catch (err) {
      //     // nothing
      //   }
      // },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
