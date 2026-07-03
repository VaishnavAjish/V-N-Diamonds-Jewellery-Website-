import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authSlice from "./features/auth/authSlice";
import cartSlice from "./features/cartSlice";
import compareSlice from "./features/compareSlice";
import productModalSlice from "./features/productModalSlice";
import shopFilterSlice from "./features/shop-filter-slice";
import wishlistSlice from "./features/wishlist-slice";
import couponSlice from "./features/coupon/couponSlice";
import orderSlice from "./features/order/orderSlice";

const syncMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  const user = state.auth.user;
  
  if (user && (user.id || user._id)) {
    // Exclude the set actions to avoid infinite loops if we dispatch them on login
    if (action.type.startsWith('cart/') && action.type !== 'cart/set_cart') {
      fetch(`http://192.168.1.211:7000/api/user/sync-cart/${user.id || user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: state.cart.cart_products })
      }).catch(() => {}); // ignore fetch errors silently in background
    } else if (action.type.startsWith('wishlist/') && action.type !== 'wishlist/set_wishlist') {
      fetch(`http://192.168.1.211:7000/api/user/sync-wishlist/${user.id || user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishlist: state.wishlist.wishlist })
      }).catch(() => {});
    }
  }
  
  return result;
};

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth:authSlice,
    productModal:productModalSlice,
    shopFilter:shopFilterSlice,
    cart:cartSlice,
    wishlist:wishlistSlice,
    compare:compareSlice,
    coupon:couponSlice,
    order:orderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, syncMiddleware),
});

export default store;
