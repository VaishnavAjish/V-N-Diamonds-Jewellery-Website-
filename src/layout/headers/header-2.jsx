import React, { useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
// internal
import Menus from './header-com/menus';
import logo from '@assets/img/logo/logo-dark.png';
import useSticky from '@/hooks/use-sticky';
import useCartInfo from '@/hooks/use-cart-info';
import { openCartMini } from '@/redux/features/cartSlice';
import HeaderTopRight from './header-com/header-top-right';
import CartMiniSidebar from '@/components/common/cart-mini-sidebar';
import { CartTwo, Compare, Facebook, Menu, PhoneTwo, Wishlist, Search, User } from '@/svg';
import SearchBar from './header-com/search-bar';
import OffCanvas from '@/components/common/off-canvas';

const HeaderTwo = ({ style_2 = false }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user: userInfo, accessToken } = useSelector((state) => state.auth);
  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { quantity } = useCartInfo();
  const { sticky } = useSticky();
  const dispatch = useDispatch();
  return (
    <>
      <header>
        <div className={`tp-header-area tp-header-style-${style_2 ? 'primary' : 'darkRed'} tp-header-height`}>
          <div id="header-sticky" className={`tp-header-bottom-2 tp-header-sticky ${sticky ? 'header-sticky' : ''}`}>
            <div className="container-fluid" style={{ paddingLeft: '85px', paddingRight: '85px' }}>
              <div className="tp-mega-menu-wrapper p-relative">
                <div className="row align-items-center">
                  <div className="col-xl-2 col-lg-2 col-6">
                    <div className="logo">
                      <Link href="/">
                        <Image src={logo} alt="logo" priority style={{ maxWidth: '120px', height: 'auto' }} />
                      </Link>
                    </div>
                  </div>
                  <div className="col-xl-8 col-lg-8 d-none d-lg-block">
                    <div className="main-menu menu-style-2">
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
                        <button onClick={() => setIsCanvasOpen(true)} type="button" className="tp-offcanvas-open-btn">
                          <Menu />
                        </button>
                      </div>
                      <div className="tp-header-login d-none d-lg-block ml-30 position-relative">
                        <div className="d-flex align-items-center">
                          {userInfo?.imageURL ? (
                            <a href={userInfo?.role?.toLowerCase() === 'admin' || userInfo?.role?.toLowerCase() === 'superadmin' ? `http://localhost:4000/auth-redirect?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(userInfo))}` : "/profile"} target={userInfo?.role?.toLowerCase() === 'admin' || userInfo?.role?.toLowerCase() === 'superadmin' ? "_blank" : "_self"} rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: `1px solid ${sticky ? 'black' : 'white'}` }}>
                              <Image
                                src={userInfo.imageURL}
                                alt="user img"
                                width={40}
                                height={40}
                                style={{ objectFit: 'cover' }}
                              />
                            </a>
                          ) : userInfo?.name ? (
                            <a href={userInfo?.role?.toLowerCase() === 'admin' || userInfo?.role?.toLowerCase() === 'superadmin' ? `http://localhost:4000/auth-redirect?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(userInfo))}` : "/profile"} target={userInfo?.role?.toLowerCase() === 'admin' || userInfo?.role?.toLowerCase() === 'superadmin' ? "_blank" : "_self"} rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', border: `1px solid ${sticky ? 'black' : 'white'}`, color: sticky ? 'black' : 'white', textDecoration: 'none' }}>
                              <span className="text-uppercase" style={{ fontSize: '18px', fontWeight: 600 }}>
                                {userInfo?.name[0]}
                              </span>
                            </a>
                          ) : (
                            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', border: `1px solid ${sticky ? 'black' : 'white'}`, color: sticky ? 'black' : 'white', textDecoration: 'none' }}>
                              <User />
                            </Link>
                          )}
                        </div>
                      </div>
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

      {/* off canvas start */}
      <OffCanvas isOffCanvasOpen={isOffCanvasOpen} setIsCanvasOpen={setIsCanvasOpen} categoryType="fashion" />
      {/* off canvas end */}
    </>
  );
};

export default HeaderTwo;
