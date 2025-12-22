import { redirect } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const next =
    typeof searchParams.next === "string"
      ? searchParams.next
      : Array.isArray(searchParams.next)
      ? searchParams.next[0]
      : undefined;

  const error =
    typeof searchParams.error === "string"
      ? searchParams.error
      : Array.isArray(searchParams.error)
      ? searchParams.error[0]
      : undefined;

  const qs = new URLSearchParams();
  if (next) qs.set("next", next);
  if (error) qs.set("error", error);

  const url = qs.toString() ? `/auth/sign-in?${qs.toString()}` : "/auth/sign-in";
  redirect(url);
}
