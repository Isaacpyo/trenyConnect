import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) redirect("/login?next=/admin");

  try {
    initAdmin();

    const decoded = await getAuth().verifySessionCookie(token, true);
    const email = (decoded.email as string) ?? "";
   const isAdmin = decoded.admin === true || ALLOWLIST.includes(email);

    if (!isAdmin) redirect("/login?error=not_authorized&next=/admin");
  } catch {
    redirect("/login?error=session_invalid&next=/admin");
  }

  return <>{children}</>;
}
