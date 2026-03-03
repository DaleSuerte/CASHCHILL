"use client";

import { useState } from "react";
import { WaitlistModal } from "@/components/waitlist-modal";
import { track } from "@/lib/analytics";

const benefits = [
  {
    title: "Disponible Chill",
    text: "Mira cuánto puedes gastar hoy sin culpas ni sustos al fin de mes."
  },
  {
    title: "Sobrecitos",
    text: "Separa en mini bolsillos para salidas, comida y antojos compartidos."
  },
  {
    title: "Cierre Express",
    text: "Cierra cuentas con tus amigos en segundos, sin hojas de cálculo." 
  }
];

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(328);

  function openModal() {
    setIsOpen(true);
    track("cta_opened");
  }

  return (
    <main className="pb-16">
      <nav className="section-shell flex items-center justify-between py-5">
        <p className="text-lg font-black">CashChill</p>
        <label className="flex items-center gap-2 rounded-full bg-lilac px-4 py-2 text-sm font-medium">
          +
          <input
            aria-label="contador waitlist"
            type="number"
            min={0}
            value={waitlistCount}
            onChange={(event) => setWaitlistCount(Number(event.target.value))}
            className="w-16 bg-transparent text-right outline-none"
          />
          en waitlist
        </label>
      </nav>

      <section className="section-shell mt-3">
        <div className="card bg-gradient-to-b from-blush to-white p-7">
          <p className="mb-2 text-sm font-semibold text-ink/70">tu plata, pero relax</p>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl">Finanzas compartidas sin dramas.</h1>
          <p className="mt-4 max-w-xl text-base text-ink/75">
            CashChill te ayuda a ordenar gastos con tu roomie, pareja o patas con alertas suaves y pasos simples. Todo en modo cute + minimal.
          </p>
          <button
            className="mt-6 w-full rounded-2xl bg-ink px-6 py-4 text-base font-semibold text-white sm:w-auto"
            onClick={openModal}
          >
            Quiero probar la beta 😌
          </button>
        </div>
      </section>

      <section className="section-shell mt-10 grid gap-4 sm:grid-cols-3">
        {benefits.map((benefit) => (
          <article key={benefit.title} className="card">
            <h2 className="text-lg font-bold">{benefit.title}</h2>
            <p className="mt-2 text-sm text-ink/70">{benefit.text}</p>
          </article>
        ))}
      </section>

      <section className="section-shell mt-10">
        <div className="card">
          <h2 className="text-2xl font-bold">Cómo funciona</h2>
          <ol className="mt-4 space-y-3 text-sm text-ink/75">
            <li>1. Conecta tu presupuesto mensual y define tus sobrecitos chill.</li>
            <li>2. Registra gastos compartidos en segundos desde tu cel.</li>
            <li>3. Cierra cuentas con un tap y sigue tu día en paz.</li>
          </ol>
        </div>
      </section>

      <section className="section-shell mt-10 grid gap-4 sm:grid-cols-2">
        <article className="card border-2 border-mint">
          <h3 className="text-xl font-bold">Free</h3>
          <p className="mt-2 text-3xl font-black">S/ 0</p>
          <p className="mt-3 text-sm text-ink/70">Disponible Chill + 2 sobrecitos + cierre básico.</p>
        </article>
        <article className="card border-2 border-lilac">
          <h3 className="text-xl font-bold">Pro</h3>
          <p className="mt-2 text-3xl font-black">S/ 9.90/mes</p>
          <p className="mt-3 text-sm text-ink/70">Sobrecitos ilimitados, cierre express y recordatorios smart.</p>
        </article>
      </section>

      <section className="section-shell mt-10">
        <div className="card">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <div className="mt-4 space-y-4 text-sm text-ink/75">
            <div>
              <p className="font-semibold">¿CashChill me va a juzgar por gastar?</p>
              <p>Nope. Sin regaños. Solo claridad ✨</p>
            </div>
            <div>
              <p className="font-semibold">¿Puedo usarlo con amigos y roomies?</p>
              <p>Sí, está pensado para grupos pequeños que comparten gastos seguido.</p>
            </div>
            <div>
              <p className="font-semibold">¿Cuándo sale la beta?</p>
              <p>Estamos invitando por tandas según la waitlist. Te avisamos por correo/WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="section-shell mt-12 text-center text-sm text-ink/60">
        Hecho con cariño por CashChill · 2026
      </footer>

      <WaitlistModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </main>
  );
}
