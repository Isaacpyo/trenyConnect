import Link from "next/link";
import AdminDashboard from "../../components/admin/AdminDashboard";
import UserManagement from "../../components/admin/UserManagement";

export default function AdminPage() {
  return (
    <section className="space-y-6">
      <AdminDashboard />
      <div className="max-w-6xl mx-auto px-6">
        <Link href="/admin/consignments" className="underline text-sm">
          View consignments →
        </Link>
      </div>
      <UserManagement />
    </section>
  );
}
