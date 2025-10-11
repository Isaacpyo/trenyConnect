"use client";

import Link from "next/link";

/* Existing app badges */
const AppleIcon = (props) => (
  <svg className="w-6 h-6 mr-2" viewBox="0 0 384 512" fill="currentColor" {...props}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C39.2 141.6 0 184.2 0 241.2c0 61.6 31.5 118.8 80.6 156.6 30.2 23.3 59.3 35.5 92.5 35.5 33.7 0 63.7-12.5 86.4-32.2-2-1.8-19.7-11.3-19.7-34.5zM224 512c33.8 0 64.7-24.4 76.7-58.5-34.5-16.7-56.8-46.7-56.8-80.2 0-35 23.3-59.3 58.5-72.8-24.4-33.8-55.5-56.8-94.3-56.8-19.7 0-44.6 13.3-64.7 13.3-19.7 0-37.5-12.5-57.5-12.5-24.4 0-52.8 11.3-73.8 30.2C13.3 392.8 0 435.4 0 481.3c0 16.7 2.8 33.8 8.3 49.2h215.7z" />
  </svg>
);

const GooglePlayIcon = (props) => (
  <svg className="w-6 h-6 mr-2" viewBox="0 0 512 512" fill="currentColor" {...props}>
    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
  </svg>
);

/* Social icons */
const XIcon = (props) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" {...props}>
    <path d="M18.244 3H21l-6.52 7.45L22 21h-6.9l-4.48-5.37L4.5 21H2l7.03-8.03L2 3h7l4.02 4.82L18.244 3Zm-2.414 16h1.33L7.24 5h-1.4l10 14Z"/>
  </svg>
);
const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" {...props}>
    <path d="M22 12.06C22 6.48 17.52 2 11.94 2 6.36 2 1.88 6.48 1.88 12.06c0 4.99 3.64 9.13 8.4 9.94v-7.03H7.97v-2.9h2.31V9.41c0-2.29 1.36-3.56 3.44-3.56.99 0 2.02.18 2.02.18v2.23h-1.14c-1.12 0-1.47.69-1.47 1.39v1.67h2.5l-.4 2.9h-2.1V22c4.75-.81 8.39-4.95 8.39-9.94Z"/>
  </svg>
);
const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" {...props}>
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8.5h4V23h-4V8.5Zm7.5 0h3.84v1.98h.06c.54-1.02 1.86-2.1 3.83-2.1 4.1 0 4.86 2.7 4.86 6.21V23h-4v-6.55c0-1.56-.03-3.56-2.17-3.56-2.17 0-2.5 1.7-2.5 3.45V23h-4V8.5Z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="h-1 bg-gradient-to-r from-[#d80000] via-red-500 to-[#d80000]" />

      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">About Treny Connect</h3>
            <p className="mt-4 text-sm text-gray-300">
              Your trusted partner for logistics between the UK and Africa. Reliable, fast, and secure shipping.
            </p>

            {/* Social row */}
            <div className="mt-4 flex items-center gap-4">
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Treny Connect on X"
                className="text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
              >
                <XIcon />
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Treny Connect on Facebook"
                className="text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Treny Connect on LinkedIn"
                className="text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-sm text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link href="/services" className="text-sm text-gray-300 hover:text-white">Our Services</Link></li>
              <li><Link href="/support" className="text-sm text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-300 hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/legal/fraud-awareness" className="text-sm text-gray-300 hover:text-white">Fraud Awareness</Link></li>
              <li><Link href="/legal/notice" className="text-sm text-gray-300 hover:text-white">Legal Notice</Link></li>
              <li><Link href="/legal/terms" className="text-sm text-gray-300 hover:text-white">Terms of Use</Link></li>
              <li><Link href="/legal/privacy" className="text-sm text-gray-300 hover:text-white">Privacy Notice</Link></li>
            </ul>
          </div>

          {/* Apps + Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Get our App</h3>
            <div className="flex flex-col space-y-3 mt-4">
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-black text-white py-2 px-3 rounded-md text-sm hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <AppleIcon /> App Store
              </a>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-black text-white py-2 px-3 rounded-md text-sm hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <GooglePlayIcon /> Google Play
              </a>
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-300">
              <p><span className="text-white">Email:</span> <a className="hover:text-white" href="mailto:support@trenyconnect.com">support@trenyconnect.com</a></p>
              <p><span className="text-white">Phone (UK):</span> <a className="hover:text-white" href="tel:+44-20-1234-5678">+44 20 1234 5678</a></p>
              <p><span className="text-white">Locations:</span> London • Lagos • Accra • Nairobi • Johannesburg</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10" />

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Treny Connect. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/legal/terms" className="hover:text-white">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/legal/cookies" className="hover:text-white">Cookies</Link>
            <Link href="/sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
