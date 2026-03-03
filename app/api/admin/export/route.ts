import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase";

function escapeCsv(value: string | null) {
  if (!value) return "";
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase
    .from("waitlist")
    .select("id, created_at, name, email, stage, frequency, whatsapp, source")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = ["id", "created_at", "name", "email", "stage", "frequency", "whatsapp", "source"].join(",");
  const rows = (data ?? []).map((row) =>
    [
      row.id,
      row.created_at,
      escapeCsv(row.name),
      escapeCsv(row.email),
      escapeCsv(row.stage),
      escapeCsv(row.frequency),
      escapeCsv(row.whatsapp),
      escapeCsv(row.source)
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cashchill-waitlist.csv"'
    }
  });
}
