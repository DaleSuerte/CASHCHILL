import Link from "next/link";
import { getAdminSupabaseClient } from "@/lib/supabase";

type AdminPageProps = {
  searchParams: { key?: string };
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const key = searchParams.key;

  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return (
      <main className="section-shell py-10">
        <div className="card">
          <h1 className="text-2xl font-bold">Acceso bloqueado</h1>
          <p className="mt-2 text-sm text-ink/70">Necesitas una admin key válida en la URL: /admin?key=...</p>
        </div>
      </main>
    );
  }

  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase
    .from("waitlist")
    .select("id, created_at, name, email, stage, frequency, whatsapp, source")
    .order("created_at", { ascending: false });

  return (
    <main className="section-shell py-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">Admin · Leads waitlist</h1>
        <Link
          href={`/api/admin/export?key=${encodeURIComponent(key)}`}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-medium text-white"
        >
          Exportar CSV
        </Link>
      </div>

      {error ? <p className="text-sm text-rose-700">Error: {error.message}</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-lilac/60">
            <tr>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Etapa</th>
              <th className="px-3 py-2">Frecuencia</th>
              <th className="px-3 py-2">WhatsApp</th>
              <th className="px-3 py-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((lead) => (
              <tr key={lead.id} className="border-t border-ink/10">
                <td className="px-3 py-2">{new Date(lead.created_at).toLocaleString("es-PE")}</td>
                <td className="px-3 py-2">{lead.name}</td>
                <td className="px-3 py-2">{lead.email}</td>
                <td className="px-3 py-2">{lead.stage}</td>
                <td className="px-3 py-2">{lead.frequency}</td>
                <td className="px-3 py-2">{lead.whatsapp || "—"}</td>
                <td className="px-3 py-2">{lead.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
