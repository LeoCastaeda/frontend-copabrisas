import React from "react";
import { motion } from "framer-motion";

/**
 * Glass Nou – Header + Logo (React + Tailwind)
 * - Paleta: rojo #FF2E2E, rojo hover #D31E1E, negro #111111, gris #4A4A4A, blanco #FFFFFF
 * - Componente responsive con CTA y motivo de "ondas/sensores" a la derecha.
 * - Incluye <LogoGlassNou /> como SVG editable.
 */

const COLORS = {
  red: "#FF2E2E",
  redDark: "#D31E1E",
  ink: "#111111",
  gray: "#4A4A4A",
  white: "#FFFFFF",
};

export function LogoGlassNou({
  height = 32,
  monochrome = false,
}: {
  height?: number;
  monochrome?: boolean;
}) {
  // Wordmark: "glass" (rojo) + "nou" (blanco, itálica)
  return (
    <svg
      role="img"
      aria-label="Glass Nou logo"
      height={height}
      viewBox="0 0 420 100"
      className="select-none"
    >
      <title>Glass Nou</title>
      {/* background transparent */}
      <g fontFamily="Montserrat, Inter, system-ui, sans-serif" fontWeight={800}>
        {/* "glass" */}
        <text
          x="0"
          y="70"
          fontSize="72"
          letterSpacing="1"
          fill={monochrome ? COLORS.white : COLORS.red}
        >
          glass
        </text>
        {/* "nou" en itálica */}
        <text
          x="245"
          y="70"
          fontSize="72"
          fontStyle="italic"
          letterSpacing="1"
          fill={COLORS.white}
        >
          nou
        </text>
      </g>
      {/* Motivo de ondas/sensores a la derecha */}
      <g transform="translate(365,50)" fill="none" stroke={COLORS.gray} strokeWidth="3">
        <path d="M0 0 m0 -4 a4 4 0 1 1 0 8 a4 4 0 1 1 0 -8" stroke={monochrome ? COLORS.white : COLORS.red} />
        <path d="M10 0 m0 -12 a12 12 0 1 1 0 24 a12 12 0 1 1 0 -24" opacity="0.8" />
        <path d="M22 0 m0 -20 a20 20 0 1 1 0 40 a20 20 0 1 1 0 -40" opacity="0.6" />
        <path d="M36 0 m0 -28 a28 28 0 1 1 0 56 a28 28 0 1 1 0 -56" opacity="0.4" />
      </g>
    </svg>
  );
}

export default function GlassNouHeader() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  async function createQuote(payload: { name: string; phone: string; plate?: string; comment?: string }) {
    try {
      const res = await fetch(`${API_URL}/api/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return (
    <header className="relative isolate overflow-hidden bg-[#111111] text-white">
      {/* Fondo con degradado sutil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(1200px 600px at 80% 20%, rgba(255,46,46,0.20), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-20 lg:py-24">
        {/* Navbar simple */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoGlassNou height={32} />
            <span className="sr-only">Glass Nou</span>
          </div>
          <nav className="hidden gap-8 text-sm md:flex">
            <a className="opacity-80 hover:opacity-100 transition" href="#servicios">Servicios</a>
            <a className="opacity-80 hover:opacity-100 transition" href="#garantias">Garantías</a>
            <a className="opacity-80 hover:opacity-100 transition" href="#taller">Taller</a>
            <a className="opacity-80 hover:opacity-100 transition" href="#contacto">Contacto</a>
          </nav>
        </div>

        {/* Hero */}
        <div className="mt-12 grid items-center gap-10 md:mt-16 md:grid-cols-2">
          {/* Texto */}
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl font-extrabold leading-tight md:text-5xl"
            >
              Especialistas en lunas de coche y calibración ADAS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="max-w-xl text-balance text-base opacity-90 md:text-lg"
            >
              Sustitución y reparación rápida, con garantía y calibración de sensores para todas las marcas. Presupuesto en minutos.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="flex flex-wrap gap-3"
            >
              {/* Abre el diálogo de presupuesto */}
              <QuoteDialog onSubmit={createQuote}>
                <a
                  href="#presupuesto"
                  className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111111]"
                  style={{ backgroundColor: COLORS.red, color: COLORS.white }}
                  onMouseEnter={(e) => ((e.currentTarget.style.backgroundColor = COLORS.redDark))}
                  onMouseLeave={(e) => ((e.currentTarget.style.backgroundColor = COLORS.red))}
                >
                  Pedir presupuesto
                </a>
              </QuoteDialog>

              {/* Llamada telefónica directa */}
              <a
                href="tel:+34900000000"
                className="inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-semibold transition hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/20"
                style={{ borderColor: COLORS.white }}
              >
                Llamar ahora
              </a>
            </motion.div>

            {/* Badges */}
            <ul className="mt-4 flex flex-wrap gap-2 text-xs opacity-80">
              {[
                "Reparación de impactos",
                "Sustitución de lunas",
                "Calibración ADAS",
                "Trabajamos con aseguradoras",
              ].map((t) => (
                <li
                  key={t}
                  className="rounded-full border px-3 py-1"
                  style={{ borderColor: COLORS.gray }}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Motivo visual de ondas */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mx-auto flex h-64 w-64 items-center justify-center rounded-full border md:h-80 md:w-80"
              style={{ borderColor: COLORS.gray }}
            >
              {/* círculo central */}
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.red }} />

              {/* anillos animados */}
              {[72, 110, 148].map((size, i) => (
                <motion.div
                  key={size}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    border: `2px solid ${i === 0 ? COLORS.red : COLORS.gray}`,
                  }}
                  initial={{ opacity: 0.0, scale: 0.9 }}
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.96, 1, 0.96] }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer mini dentro del header (opcional) */}
      <div className="mx-auto max-w-7xl px-6 pb-10">
        <div className="mt-10 flex flex-wrap items-center gap-6 text-xs opacity-70">
          <span>Atención el mismo día</span>
          <span>•</span>
          <span>Garantía por escrito</span>
          <span>•</span>
          <span>Taller móvil disponible</span>
        </div>
      </div>
    </header>
  );
}

function QuoteDialog({ onSubmit, children }: { onSubmit: (p: { name: string; phone: string; plate?: string; comment?: string }) => Promise<unknown>; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [ok, setOk] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  return (
    <>
      <button onClick={() => setOpen(true)} className="contents">{children}</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-black shadow-xl">
            <h2 className="text-xl font-bold">Pedir presupuesto</h2>
            <p className="mt-1 text-sm opacity-70">Déjanos tus datos y te llamamos.</p>
            <form
              className="mt-4 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setOk(null);
                setErr(null);
                const fd = new FormData(e.currentTarget as HTMLFormElement);
                const payload = {
                  name: String(fd.get("name") || ""),
                  phone: String(fd.get("phone") || ""),
                  plate: String(fd.get("plate") || ""),
                  comment: String(fd.get("comment") || ""),
                };
                try {
                  await onSubmit(payload);
                  setOk("¡Enviado! Te contactaremos en breve.");
                  (e.currentTarget as HTMLFormElement).reset();
                } catch {
                  setErr("No se pudo enviar. Inténtalo de nuevo.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div className="grid grid-cols-1 gap-3">
                <input name="name" required placeholder="Nombre" className="rounded-xl border px-3 py-2" />
                <input name="phone" required placeholder="Teléfono" className="rounded-xl border px-3 py-2" />
                <input name="plate" placeholder="Matrícula (opcional)" className="rounded-xl border px-3 py-2" />
                <textarea name="comment" placeholder="Comentario" className="rounded-xl border px-3 py-2" rows={3} />
              </div>
              {ok && <p className="text-sm text-green-600">{ok}</p>}
              {err && <p className="text-sm text-red-600">{err}</p>}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl px-4 py-2 font-semibold text-white"
                  style={{ backgroundColor: COLORS.red }}
                >
                  {loading ? "Enviando…" : "Enviar"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="rounded-xl border px-4 py-2">Cerrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
