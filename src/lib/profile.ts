/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/profile.ts
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export type UserProfile = {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  // photoURL removed (no Storage)
  role?: "user" | "admin";
  createdAt?: any;
  updatedAt?: any;
};

function profileRef(uid: string) {
  return doc(db, "users", uid);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(profileRef(uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function upsertUserProfile(profile: UserProfile) {
  await setDoc(
    profileRef(profile.uid),
    { ...profile, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function updateUserProfile(uid: string, patch: Partial<UserProfile>) {
  await updateDoc(profileRef(uid), { ...patch, updatedAt: serverTimestamp() });
}
