import { NextResponse } from "next/server";
import { getPublicSupabaseClient } from "@/lib/supabase";
import { waitlistSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = waitlistSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Datos inválidos." },
        { status: 400 }
      );
    }

    const supabase = getPublicSupabaseClient();
    const { error } = await supabase.from("waitlist").insert(parsed.data);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Ese correo ya está en la waitlist 😌" },
          { status: 409 }
        );
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "No pudimos guardar tus datos. Intenta en un ratito." },
      { status: 500 }
    );
  }
}
