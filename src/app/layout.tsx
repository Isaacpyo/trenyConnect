import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://trenyconnect.com"), // update if different
  title: {
    default: "Treny Connect — Africa ↔ UK Courier",
    template: "%s — Treny Connect",
  },
  description:
    "Create, pay and track consignments. Reliable pickup, customs and door delivery.",
  openGraph: {
    title: "Treny Connect — Africa ↔ UK Courier",
    description:
      "Create, pay and track consignments. Reliable pickup, customs and door delivery.",
    url: "https://trenyconnect.com",
    siteName: "Treny Connect",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Treny Connect" }],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Treny Connect — Africa ↔ UK Courier",
    description:
      "Create, pay and track consignments. Reliable pickup, customs and door delivery.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: { canonical: "https://trenyconnect.com" },
};

export const viewport: Viewport = {
  themeColor: "#d80000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Treny Connect",
    url: "https://trenyconnect.com",
    logo: "https://trenyconnect.com/android-chrome-512x512.png",
    sameAs: [
      "https://x.com/", // update your real profiles
      "https://facebook.com/",
      "https://www.linkedin.com/",
    ],
  };

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased`}>
        {/* Skip link for a11y */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:shadow"
        >
          Skip to content
        </a>

        <Providers>
          <Header />
          <main id="main" className="flex-1">{children}</main>
          {/* header here */}
        
        <ChatWidget /> {/* <- new */}
          <Footer />
        </Providers>

        {/* JSON-LD (SEO) */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD injection
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* optional: a portal root for modals/tooltips */}
        <div id="portal-root" />
      </body>
    </html>
  );
};



