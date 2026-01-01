export default function ServiceCard({ item }) {
  return (
    <div className="border rounded-2xl p-5 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold text-slate-900">{item.name}</div>
          <div className="text-xs text-slate-600 mt-1">{item.category || "General"}</div>
        </div>
        {item.featured ? (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-800">
            Popular
          </span>
        ) : null}
      </div>
      {item.description ? <p className="text-sm text-slate-700 mt-3">{item.description}</p> : null}
    </div>
  );
}
