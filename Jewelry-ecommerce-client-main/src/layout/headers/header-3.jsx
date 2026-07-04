import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { userLoggedOut } from '@/redux/features/auth/authSlice';
// internal
import logo_white from '@assets/img/logo/logo-white.png';
import logo_dark from '@assets/img/logo/logo-dark.png';
import { CartTwo, Menu, Search, Wishlist, User } from '@/svg';
import Menus from './header-com/menus';
import useSticky from '@/hooks/use-sticky';
import SearchBar from './header-com/search-bar';
import OffCanvas from '@/components/common/off-canvas';
import CartMiniSidebar from '@/components/common/cart-mini-sidebar';
import useCartInfo from '@/hooks/use-cart-info';
import { openCartMini } from '@/redux/features/cartSlice';
import LogoutModal from '@/components/common/LogoutModal';

const HeaderThree = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user: userInfo, accessToken } = useSelector((state) => state.auth);
  const { quantity } = useCartInfo();
  const { sticky } = useSticky();
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
    <>
      <header>
        <div id="header-sticky" className={`tp-header-area tp-header-style-transparent-white tp-header-transparent tp-header-sticky has-dark-logo tp-header-height ${sticky ? 'header-sticky' : ''}`}>
          <div className="tp-header-bottom-3 pl-35 pr-35">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-xl-2 col-lg-2 col-6">
                  <div className="logo">
                    <Link href="/">
                      <Image className="logo-light" src={logo_white} alt="logo" unoptimized={true} style={{ maxWidth: '120px', height: 'auto' }} />
                      <Image className="logo-dark" src={logo_dark} alt="logo" unoptimized={true} style={{ maxWidth: '120px', height: 'auto' }} />
                    </Link>
                  </div>
                </div>
                <div className="col-xl-8 col-lg-8 d-none d-lg-block">
                  <div className="main-menu menu-style-3 p-relative d-flex align-items-center justify-content-center">
                    <nav className="tp-main-menu-content">
                      <Menus />
                    </nav>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-2 col-6">
                  <div className="tp-header-action d-flex align-items-center justify-content-end ml-50">
                    <div className="tp-header-action-item d-none d-sm-block">
                      <button onClick={() => setIsSearchOpen(true)} type="button" className="tp-header-action-btn tp-search-open-btn">
                        <Search />
                      </button>
                    </div>
                    <div className="tp-header-action-item d-none d-sm-block">
                      <Link href="/wishlist" className="tp-header-action-btn">
                        <Wishlist />
                        <span className="tp-header-action-badge">{wishlist.length}</span>
                      </Link>
                    </div>
                    <div className="tp-header-action-item d-none d-sm-block">
                      <button onClick={() => dispatch(openCartMini())} type="button" className="tp-header-action-btn cartmini-open-btn">
                        <CartTwo />
                        <span className="tp-header-action-badge">{quantity}</span>
                      </button>
                    </div>
                    <div className="tp-header-action-item d-lg-none">
                      <button onClick={() => setIsCanvasOpen(true)} type="button" className="tp-header-action-btn tp-offcanvas-open-btn">
                        <Menu />
                      </button>
                    </div>
                    <div className="tp-header-action-item tp-header-login d-none d-lg-block ml-30 position-relative">
                      <div className="d-flex align-items-center">
                        {userInfo?.imageURL ? (
                          <a onClick={() => { setIsDropdownOpen(!isDropdownOpen); setShowLogoutConfirm(false); }} className="cursor-pointer tp-header-action-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid currentColor', backgroundColor: 'transparent' }}>
                            <Image
                              src={userInfo.imageURL}
                              alt="user img"
                              width={40}
                              height={40}
                              style={{ objectFit: 'cover' }}
                            />
                          </a>
                        ) : userInfo?.name ? (
                          <a onClick={() => { setIsDropdownOpen(!isDropdownOpen); setShowLogoutConfirm(false); }} className="cursor-pointer tp-header-action-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid currentColor', backgroundColor: 'transparent', textDecoration: 'none' }}>
                            <span className="text-uppercase" style={{ fontSize: '18px', fontWeight: 600 }}>
                              {userInfo?.name[0]}
                            </span>
                          </a>
                        ) : (
                          <Link href="/login" className="tp-header-action-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid currentColor', backgroundColor: 'transparent', textDecoration: 'none' }}>
                            <User />
                          </Link>
                        )}
                      </div>

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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* search bar start */}
      <SearchBar isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
      {/* search bar end */}

      {/* cart mini sidebar start */}
      <CartMiniSidebar />
      {/* cart mini sidebar end */}

      <LogoutModal 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
        onConfirm={handleLogout} 
      />
      {/* cart mini sidebar end */}

      {/* off canvas start */}
      <OffCanvas isOffCanvasOpen={isOffCanvasOpen} setIsCanvasOpen={setIsCanvasOpen} categoryType="beauty" />
      {/* off canvas end */}
    </>
  );
};

export default HeaderThree;
