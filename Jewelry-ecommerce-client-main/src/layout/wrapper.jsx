import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
// internal
import ProductModal from "@/components/common/product-modal";
import {
  get_cart_products,
  initialOrderQuantity,
} from "@/redux/features/cartSlice";
import { get_wishlist_products } from "@/redux/features/wishlist-slice";
import { get_compare_products } from "@/redux/features/compareSlice";
import useAuthCheck from "@/hooks/use-auth-check";
import Loader from "@/components/loader/loader";

const Wrapper = ({ children }) => {
  const { productItem } = useSelector((state) => state.productModal);
  const dispatch = useDispatch();
  const authChecked = useAuthCheck();

  useEffect(() => {
    dispatch(get_cart_products());
    dispatch(get_wishlist_products());
    dispatch(get_compare_products());
    dispatch(initialOrderQuantity());
  }, [dispatch]);

  const cart_products = useSelector((state) => state.cart.cart_products);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (authChecked && user?._id) {
      fetch(`http://192.168.1.211:7000/api/user/sync-cart/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cart_products })
      }).catch(e => console.error("Cart sync error", e));
    }
  }, [cart_products, authChecked, user?._id]);

  useEffect(() => {
    if (authChecked && user?._id) {
      fetch(`http://192.168.1.211:7000/api/user/sync-wishlist/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishlist: wishlist })
      }).catch(e => console.error("Wishlist sync error", e));
    }
  }, [wishlist, authChecked, user?._id]);

  return !authChecked ? (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <Loader spinner="fade" loading={!authChecked} />
    </div>
  ) : (
    <div id="wrapper">
      {children}
      <ToastContainer />
      {/* product modal start */}
      {productItem && <ProductModal />}
      {/* product modal end */}
    </div>
  );
};

export default Wrapper;
