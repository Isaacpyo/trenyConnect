import { cookies } from "next/headers";
import { NextResponse } from "next/server";
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

const COOKIE_NAME = "fb_token";
const MAX_AGE = 60 * 60 * 24 * 5; // 5 days

export async function POST(req: Request) {
  try {
    initAdmin();
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const decoded = await getAuth().verifyIdToken(idToken, true);

    // TEMP allowlist while you set custom claims:
    const ALLOWLIST = ["trenylimited@gmail.com", "admin@trenyconnect.com"];
    const isAdmin = decoded.admin === true || ALLOWLIST.includes(decoded.email ?? "");
    if (!isAdmin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const cookieStore = await cookies();
    cookieStore.set({
      name: COOKIE_NAME,
      value: idToken,
      httpOnly: true,
      sameSite: "lax",
      secure: true, // set false only for http://localhost if needed
      maxAge: MAX_AGE,
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Auth error" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set({ name: COOKIE_NAME, value: "", maxAge: 0, path: "/" });
  return NextResponse.json({ ok: true });
}
