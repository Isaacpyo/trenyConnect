"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, logout } from "@/lib/firebaseClient";

const CenterNavItem = ({ href, children }) => (
  <Link
    href={href}
    className="px-3 py-2 rounded-md hover:bg-[#d80000]/10 hover:text-[#d80000] transition-colors"
  >
    {children}
  </Link>
);

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // lock page scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  async function handleLogout() {
    await logout(); // clears cookie + firebase session
    router.replace("/auth/sign-in");
  }

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur border-b z-50">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-[#d80000]">
          Treny Connect
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex justify-center flex-1">
          <div className="flex items-center gap-1 text-sm font-medium">
            <CenterNavItem href="/create">Ship &amp; Quote</CenterNavItem>
            <CenterNavItem href="/services">Our Services</CenterNavItem>
            <CenterNavItem href="/about">About Us</CenterNavItem>
            <CenterNavItem href="/support">Support</CenterNavItem>
          </div>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            {!loading && user ? (
              <>
                <Link
                  href="/account"
                  className="px-4 py-2 rounded-lg border border-[#d80000] text-[#d80000] hover:bg-[#d80000]/5 transition"
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-[#d80000] text-white hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              !loading && (
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
              )
            )}
          </div>

          {/* Hamburger */}
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
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <span className="font-semibold text-[#d80000]">Menu</span>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <nav className="p-3">
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

              {!loading && user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center px-4 py-2 rounded-lg border border-[#d80000] text-[#d80000]"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={async () => {
                      setOpen(false);
                      await handleLogout();
                    }}
                    className="mt-2 block w-full px-4 py-2 rounded-lg bg-[#d80000] text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/sign-in"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center px-4 py-2 rounded-lg bg-[#d80000] text-white mb-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center px-4 py-2 rounded-lg border border-[#d80000] text-[#d80000]"
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
      className="block px-3 py-3 rounded-md hover:bg-[#d80000]/10 hover:text-[#d80000]"
    >
      {children}
    </Link>
  );
}
