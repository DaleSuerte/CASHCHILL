"use client";

import { FormEvent, useState } from "react";
import { track } from "@/lib/analytics";

type WaitlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const initialState = {
  name: "",
  email: "",
  stage: "uni",
  frequency: "semanal",
  whatsapp: "",
  source: "landing"
};

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Ups, no se pudo enviar.");
        track("waitlist_error", { props: { reason: data.error ?? "unknown" } });
        return;
      }

      setMessage("¡Listo! Te escribiremos cuando abramos la beta ✨");
      setForm(initialState);
      track("waitlist_submitted", { props: { stage: form.stage, frequency: form.frequency } });
    } catch (submitError) {
      setError("No hay conexión por ahora. Intenta en un minuto.");
      track("waitlist_error", { props: { reason: "network" } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Quiero probar la beta 😌</h2>
            <p className="text-sm text-ink/70">Sin regaños. Solo claridad ✨</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-blush px-3 py-1 text-sm font-medium"
          >
            Cerrar
          </button>
        </div>

        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Tu nombre"
            className="w-full rounded-2xl border border-ink/10 px-4 py-3 text-base"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="tu@email.com"
            className="w-full rounded-2xl border border-ink/10 px-4 py-3 text-base"
          />
          <select
            value={form.stage}
            onChange={(event) => setForm({ ...form, stage: event.target.value })}
            className="w-full rounded-2xl border border-ink/10 px-4 py-3 text-base"
          >
            <option value="uni">Estoy en la uni</option>
            <option value="trabajo">Estoy chambeando</option>
          </select>
          <select
            value={form.frequency}
            onChange={(event) => setForm({ ...form, frequency: event.target.value })}
            className="w-full rounded-2xl border border-ink/10 px-4 py-3 text-base"
          >
            <option value="casi-nunca">Casi nunca gasto con otros</option>
            <option value="semanal">Varias veces por semana</option>
            <option value="varias-veces">Todos los días casi</option>
          </select>
          <input
            value={form.whatsapp}
            onChange={(event) => setForm({ ...form, whatsapp: event.target.value })}
            placeholder="WhatsApp (opcional)"
            className="w-full rounded-2xl border border-ink/10 px-4 py-3 text-base"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-ink px-4 py-3 text-base font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Entrar a la waitlist"}
          </button>

          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          <p className="text-xs text-ink/60">Alertas suaves, cero spam.</p>
        </form>
      </div>
    </div>
  );
}
