"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";

const CenterNavItem = ({ href, children }) => (
  <Link
    href={href}
    className="px-3 py-2 rounded-md hover:bg-[#d80000]/10 hover:text-[#d80000] transition-colors"
  >
    {children}
  </Link>
);

export default function Header() {
  const { user } = useAppContext();
  const [open, setOpen] = useState(false);

  // lock page scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [open]);

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur border-b z-50">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-[#d80000]">
          Treny Connect
        </Link>

        {/* Center nav (desktop) */}
        <nav className="hidden md:flex justify-center flex-1">
          <div className="flex items-center gap-1 text-sm font-medium">
            <CenterNavItem href="/create">Ship &amp; Quote</CenterNavItem>
            <CenterNavItem href="/services">Our Services</CenterNavItem>
            <CenterNavItem href="/about">About Us</CenterNavItem>
            <CenterNavItem href="/support">Support</CenterNavItem>
          </div>
        </nav>

        {/* Right side: auth OR account + hamburger */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/account"
                  className="px-4 py-2 rounded-lg border border-[#d80000] text-[#d80000] hover:bg-[#d80000]/5 transition"
                >
                  My Account
                </Link>
                <form action="/api/logout" method="post">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#d80000] text-white hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  className="px-4 py-2 rounded-lg bg-[#d80000] text-white hover:bg-red-700 transition"
                >
                  Login
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-4 py-2 rounded-lg border border-[#d80000] text-[#d80000] hover:bg-[#d80000]/5 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger on right */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md bg-white border hover:bg-gray-50"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span className="block h-0.5 w-5 bg-gray-700 mb-1"></span>
            <span className="block h-0.5 w-5 bg-gray-700 mb-1"></span>
            <span className="block h-0.5 w-5 bg-gray-700"></span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/30 md:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed top-0 right-0 h-full w-72 bg-white shadow-xl md:hidden">
            <div className="flex items-center justify-between h-16 px-4 border-b bg-white">
              <span className="font-semibold text-[#d80000]">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="p-3 bg-white h-full">
              <MobileItem href="/create" onClick={() => setOpen(false)}>
                Ship &amp; Quote
              </MobileItem>
              <MobileItem href="/services" onClick={() => setOpen(false)}>
                Our Services
              </MobileItem>
              <MobileItem href="/about" onClick={() => setOpen(false)}>
                About Us
              </MobileItem>
              <MobileItem href="/support" onClick={() => setOpen(false)}>
                Support
              </MobileItem>

              <div className="h-px bg-gray-200 my-3" />

              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center px-4 py-2 rounded-lg border border-[#d80000] text-[#d80000] hover:bg-[#d80000]/5 transition bg-white"
                  >
                    My Account
                  </Link>
                  <form action="/api/logout" method="post" className="mt-2">
                    <button
                      type="submit"
                      onClick={() => setOpen(false)}
                      className="block w-full text-center px-4 py-2 rounded-lg bg-[#d80000] text-white hover:bg-red-700 transition"
                    >
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/sign-in"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center px-4 py-2 rounded-lg bg-[#d80000] text-white hover:bg-red-700 transition mb-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center px-4 py-2 rounded-lg border border-[#d80000] text-[#d80000] hover:bg-[#d80000]/5 transition bg-white"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </aside>
        </>
      )}
    </header>
  );
}

function MobileItem({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-3 rounded-md text-[15px] bg-white hover:bg-[#d80000]/10 hover:text-[#d80000] transition-colors"
    >
      {children}
    </Link>
  );
}
