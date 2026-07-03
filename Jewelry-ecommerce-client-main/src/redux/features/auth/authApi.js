import { apiSlice } from "@/redux/api/apiSlice";
import { userLoggedIn } from "./authSlice";
import Cookies from "js-cookie";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: "http://192.168.1.211:7000/api/user/signup",
        method: "POST",
        body: data,
      }),
    }),
    // signUpProvider
    signUpProvider: builder.mutation({
      query: (token) => ({
        url: `http://192.168.1.211:7000/api/user/register/${token}`,
        method: "POST",
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          Cookies.set(
            "userInfo",
            JSON.stringify({
              accessToken: result.data.data.token,
              user: result.data.data.user,
            }),
            { expires: 0.5 }
          );

          dispatch(
            userLoggedIn({
              accessToken: result.data.data.token,
              user: result.data.data.user,
            })
          );
        } catch (err) {
          // do nothing
        }
      },
    }),
    // login
    loginUser: builder.mutation({
      query: (data) => ({
        url: "http://192.168.1.211:7000/api/user/login",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          const result = await queryFulfilled;
          const user = result.data.data.user;

          Cookies.set(
            "userInfo",
            JSON.stringify({
              accessToken: result.data.data.token,
              user: user,
            }),
            { expires: 0.5 }
          );

          dispatch(
            userLoggedIn({
              accessToken: result.data.data.token,
              user: user,
            })
          );

          // Get local state
          const state = getState();
          const localCart = state.cart.cart_products || [];
          const localWishlist = state.wishlist.wishlist || [];

          // Merge or override logic:
          // If local is empty but DB has data, use DB data.
          if (localCart.length === 0 && user.cart && user.cart.length > 0) {
            dispatch({ type: 'cart/set_cart', payload: user.cart });
          } else if (localCart.length > 0) {
            // Push local to DB (we can do this in a separate thunk or API call, but doing a simple fetch here is fine)
            fetch(`http://192.168.1.211:7000/api/user/sync-cart/${user.id || user._id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cart: localCart })
            });
          }

          if (localWishlist.length === 0 && user.wishlist && user.wishlist.length > 0) {
            dispatch({ type: 'wishlist/set_wishlist', payload: user.wishlist });
          } else if (localWishlist.length > 0) {
            fetch(`http://192.168.1.211:7000/api/user/sync-wishlist/${user.id || user._id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ wishlist: localWishlist })
            });
          }

          // Admins stay on the frontend; they can use the Admin link in the navbar
        } catch (err) {
          // do nothing
        }
      },
    }),
    // get me
    getUser: builder.query({
      query: () => "http://192.168.1.211:7000/api/user/me",

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              user: result.data,
            })
          );
        } catch (err) {
          // do nothing
        }
      },
    }),
    // confirmEmail
    confirmEmail: builder.query({
      query: (token) => `http://192.168.1.211:7000/api/user/confirmEmail/${token}`,

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          Cookies.set(
            "userInfo",
            JSON.stringify({
              accessToken: result.data.data.token,
              user: result.data.data.user,
            }),
            { expires: 0.5 }
          );

          dispatch(
            userLoggedIn({
              accessToken: result.data.data.token,
              user: result.data.data.user,
            })
          );
        } catch (err) {
          // do nothing
        }
      },
    }),
    // reset password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "http://192.168.1.211:7000/api/user/forget-password",
        method: "PATCH",
        body: data,
      }),
    }),
    // confirmForgotPassword
    confirmForgotPassword: builder.mutation({
      query: (data) => ({
        url: "http://192.168.1.211:7000/api/user/confirm-forget-password",
        method: "PATCH",
        body: data,
      }),
    }),
    // change password
    changePassword: builder.mutation({
      query: (data) => ({
        url: "http://192.168.1.211:7000/api/user/change-password",
        method: "PATCH",
        body: data,
      }),
    }),
    // updateProfile password
    updateProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `http://192.168.1.211:7000/api/user/update-user/${id}`,
        method: "PUT",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          Cookies.set(
            "userInfo",
            JSON.stringify({
              accessToken: result.data.data.token,
              user: result.data.data.user,
            }),
            { expires: 0.5 }
          );

          dispatch(
            userLoggedIn({
              accessToken: result.data.data.token,
              user: result.data.data.user,
            })
          );
        } catch (err) {
          // do nothing
        }
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useConfirmEmailQuery,
  useResetPasswordMutation,
  useConfirmForgotPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useSignUpProviderMutation,
} = authApi;
