export default function ShipmentDocuments({ urls }: { urls?: string[] }) {
  if (!urls || urls.length === 0) return null;
  return (
    <div className="rounded-lg border bg-white p-4">
      <h2 className="font-semibold mb-2">Documents</h2>
      <ul className="list-disc list-inside text-sm">
        {urls.map((u) => (
          <li key={u}>
            <a className="text-blue-600 underline" href={u} target="_blank" rel="noreferrer">
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
