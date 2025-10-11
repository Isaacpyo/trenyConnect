"use client";

import Button from "@/components/common/Button";
import { useAppContext } from "@/hooks/useAppContext";
import { logout } from "@/lib/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading } = useAppContext();
  const router = useRouter();

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [user, loading, router]);

  if (loading) return <div className="p-8">Loading…</div>;
  if (!user) return null;

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Profile</h1>
      <div className="rounded-lg border p-4 bg-white">
        <p className="mb-2"><span className="font-medium">Email:</span> {user.email}</p>
        <Button onClick={logout}>Log out</Button>
      </div>
    </section>
  );
}
