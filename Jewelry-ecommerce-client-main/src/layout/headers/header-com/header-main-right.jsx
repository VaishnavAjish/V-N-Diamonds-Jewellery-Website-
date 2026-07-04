import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
// internal
import useCartInfo from "@/hooks/use-cart-info";
import { CartTwo, Compare, Menu, User, Wishlist } from "@/svg";
import { openCartMini } from "@/redux/features/cartSlice";
import { userLoggedOut } from "@/redux/features/auth/authSlice";
import LogoutModal from "@/components/common/LogoutModal";

const HeaderMainRight = ({ setIsCanvasOpen }) => {
  const { user: userInfo, accessToken } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { quantity } = useCartInfo();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push('/');
    setIsDropdownOpen(false);
    setShowLogoutConfirm(false);
  };

  return (
    <div className="tp-header-main-right d-flex align-items-center justify-content-end">
      <div className="tp-header-action d-flex align-items-center">
        <div className="tp-header-action-item d-none d-lg-block">
          <Link href="/compare" className="tp-header-action-btn">
            <Compare />
          </Link>
        </div>
        <div className="tp-header-action-item d-none d-lg-block">
          <Link href="/wishlist" className="tp-header-action-btn">
            <Wishlist />
            <span className="tp-header-action-badge">{wishlist.length}</span>
          </Link>
        </div>
        <div className="tp-header-action-item">
          <button
            onClick={() => dispatch(openCartMini())}
            type="button"
            className="tp-header-action-btn cartmini-open-btn"
          >
            <CartTwo />
            <span className="tp-header-action-badge">{quantity}</span>
          </button>
        </div>
        <div className="tp-header-action-item d-lg-none">
          <button
            onClick={() => setIsCanvasOpen(true)}
            type="button"
            className="tp-header-action-btn tp-offcanvas-open-btn"
          >
            <Menu />
          </button>
        </div>
      </div>
      <div 
        className="tp-header-login d-none d-lg-block ml-50 position-relative"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
          {userInfo?.imageURL ? (
          <a onClick={() => setShowLogoutConfirm(false)} className="cursor-pointer tp-header-action-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid currentColor', backgroundColor: 'transparent' }}>
              <Image
                src={userInfo.imageURL}
                alt="user img"
                width={38}
                height={38}
                style={{ objectFit: 'cover' }}
              />
            </a>
          ) : userInfo?.name ? (
          <a onClick={() => setShowLogoutConfirm(false)} className="cursor-pointer tp-header-action-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', border: '1.5px solid currentColor', backgroundColor: 'transparent', textDecoration: 'none' }}>
              <span className="text-uppercase" style={{ fontSize: '16px', fontWeight: 600 }}>
                {userInfo?.name[0]}
              </span>
            </a>
          ) : (
          <Link href="/login" onClick={() => setShowLogoutConfirm(false)} className="tp-header-action-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', border: '1.5px solid currentColor', backgroundColor: 'transparent', textDecoration: 'none' }}>
              <User />
            </Link>
          )}

          {userInfo && (
            <div style={{ position: 'absolute', top: '120%', right: 0, left: 'auto', backgroundColor: 'white', padding: '15px 25px', zIndex: 99, minWidth: '150px', borderRadius: '12px', boxShadow: '0px 15px 40px rgba(0,0,0,0.08)', opacity: isDropdownOpen ? 1 : 0, visibility: isDropdownOpen ? 'visible' : 'hidden', transform: isDropdownOpen ? 'translateY(0)' : 'translateY(15px)', transition: 'all 0.3s ease-in-out' }}>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                <li style={{ paddingBottom: '10px', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '10px' }}>
                  <a href={userInfo?.role?.toLowerCase() === 'admin' || userInfo?.role?.toLowerCase() === 'superadmin' ? `${process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:4000'}/auth-redirect?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(userInfo))}` : "/profile"} target={userInfo?.role?.toLowerCase() === 'admin' || userInfo?.role?.toLowerCase() === 'superadmin' ? "_blank" : "_self"} style={{ color: 'black', textDecoration: 'none', display: 'block', fontSize: '15px', fontWeight: 600 }}>
                    {userInfo?.role?.toLowerCase() === 'admin' || userInfo?.role?.toLowerCase() === 'superadmin' ? 'Admin Panel' : 'My Profile'}
                  </a>
                </li>
                <li style={{ margin: 0 }}>
                  <a onClick={() => { setShowLogoutConfirm(true); setIsDropdownOpen(false); }} className="cursor-pointer" style={{ color: 'red', textDecoration: 'none', display: 'block', fontSize: '15px', fontWeight: 600 }}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          )}
      </div>

      <LogoutModal 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
        onConfirm={handleLogout} 
      />
    </div>
  );
};

export default HeaderMainRight;
