'use client';

import Link from 'next/link';
import HamburgerButton from '@/layouts/hamburger-button';
import SearchWidget from '@/components/search/search';
import Sidebar from '@/layouts/hydrogen/sidebar';
import Logo from '@/components/logo';
import HeaderMenuRight from '@/layouts/header-menu-right';
import StickyHeader from '@/layouts/sticky-header';
import SearchByImageWidget from '@/components/search/search-by-image';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useLocation } from 'react-use';

export default function Header() {
  const session: any = useSession();
  // let location;
  // useEffect(() => {
  //   location = window.location.pathname
  // })
  const location : any = useLocation();

  return (
    <StickyHeader className="z-[990] 2xl:py-5 3xl:px-8  4xl:px-10">
      <div className="flex w-full max-w-2xl items-center">
        <HamburgerButton
          view={<Sidebar className="static w-full 2xl:w-full" />}
        />
        <Link
          href={'/'}
          aria-label="Site Logo"
          className="me-4 w-9 shrink-0 text-gray-800 hover:text-gray-900 lg:me-5 xl:hidden"
        >
          <Logo iconOnly={true} />
        </Link>
        {location?.pathname === "/" && session.data?.userData?.userrole !== 'admin' && (
          <>
            <SearchWidget />
            <SearchByImageWidget />
          </>
        )}
      </div>

      <HeaderMenuRight />
    </StickyHeader>
  );
}
