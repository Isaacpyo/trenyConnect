/* eslint-disable @typescript-eslint/no-explicit-any */
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
const EXPIRES_IN_MS = 5 * 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    initAdmin();

    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    // Verify user
    const decoded = await getAuth().verifyIdToken(idToken);

    // Create SESSION cookie for everyone
    const sessionCookie = await getAuth().createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN_MS,
    });

    (await cookies()).set({
      name: COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: Math.floor(EXPIRES_IN_MS / 1000),
      path: "/",
    });

    // Optionally return basic user info
    return NextResponse.json({
      ok: true,
      user: { uid: decoded.uid, email: decoded.email ?? null },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Auth error" }, { status: 401 });
  }
}

export async function DELETE() {
  (await cookies()).set({ name: COOKIE_NAME, value: "", maxAge: 0, path: "/" });
  return NextResponse.json({ ok: true });
}
