import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function initAdmin() {
  if (!getApps().length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const token = req.cookies.get("fb_token")?.value;
  if (!token) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    initAdmin();
    const decoded = await getAuth().verifyIdToken(token, true);

    const allow =
      decoded.admin === true ||
      ["trenylimited@gmail.com", "admin@trenyconnect.com"].includes(decoded.email ?? "");

    if (!allow) throw new Error("Not authorized");
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = { matcher: ["/admin/:path*"] };
