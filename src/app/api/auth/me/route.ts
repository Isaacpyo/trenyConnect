import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function initAdmin() {
  if (!getApps().length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      throw new Error("Missing Firebase Admin env vars");
    }
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }
}

const COOKIE_NAME = "fb_token";
const ALLOWLIST = ["trenylimited@gmail.com", "admin@trenyconnect.com"];

export async function GET() {
  try {
    initAdmin();

    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 401 });

    const decoded = await getAuth().verifySessionCookie(token, true);
    const email = decoded.email ?? "";
    const isAdmin = decoded.admin === true || ALLOWLIST.includes(email);

    return NextResponse.json({
      user: { uid: decoded.uid, email, isAdmin },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
