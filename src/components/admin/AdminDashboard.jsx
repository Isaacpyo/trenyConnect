export default function AdminDashboard() {
  return (
    <section className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-white"><h3 className="font-semibold">Shipments Today</h3><p className="text-2xl">0</p></div>
        <div className="p-4 rounded-lg border bg-white"><h3 className="font-semibold">Pending</h3><p className="text-2xl">0</p></div>
        <div className="p-4 rounded-lg border bg-white"><h3 className="font-semibold">Delivered</h3><p className="text-2xl">0</p></div>
      </div>
    </section>
  );
}
