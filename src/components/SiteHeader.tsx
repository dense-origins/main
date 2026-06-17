'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

/**
 * Sticky site header with mobile nav drawer — ported from the static
 * site's <header class="site-header"> + <nav class="mobile-nav">.
 *
 * `dark` mirrors the .dark-nav variant used on the contact page.
 */
export default function SiteHeader({ dark = false }: { dark?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`site-header${scrolled ? ' scrolled' : ''}${dark ? ' dark-nav' : ''}`}
        id="site-header"
      >
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <Image
              src="/images/dense_origins_text_right.png"
              alt="Dense Origins"
              width={160}
              height={44}
              priority
            />
          </Link>
          <nav aria-label="Main navigation">
            <ul className="nav-links" role="list">
              <li>
                <Link href="/shop">Products</Link>
              </li>
              <li>
                <Link href="/#about">About</Link>
              </li>
              <li>
                <Link href="/#process">Process</Link>
              </li>
              <li>
                <Link href="/#why">Why Us</Link>
              </li>
              <li>
                <Link href="/#faq">FAQ</Link>
              </li>
            </ul>
          </nav>
          <div className="nav-right">
            <Link href="/contact" className="nav-cta">
              Enquire
            </Link>
            <button
              className="nav-hamburger"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <nav className={`mobile-nav${mobileOpen ? ' open' : ''}`} aria-label="Mobile navigation">
        <button className="mobile-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
          ✕
        </button>
        <Link href="/shop" onClick={() => setMobileOpen(false)}>
          Products
        </Link>
        <Link href="/#about" onClick={() => setMobileOpen(false)}>
          About
        </Link>
        <Link href="/#why" onClick={() => setMobileOpen(false)}>
          Why Us
        </Link>
        <Link href="/contact" onClick={() => setMobileOpen(false)}>
          Enquire →
        </Link>
      </nav>
    </>
  );
}
