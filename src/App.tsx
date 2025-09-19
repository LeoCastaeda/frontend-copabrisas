import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

// ---------- Minimal design tokens (Tailwind classes) ----------
const shell = {
  card: "bg-white/80 backdrop-blur shadow-sm rounded-2xl border border-slate-200",
  panel: "bg-white/60 backdrop-blur border border-slate-200",
  btn: "inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium shadow-sm border border-slate-300 hover:bg-slate-50 active:translate-y-px",
  btnPrimary: "inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium shadow-sm text-white bg-slate-900 hover:bg-slate-800 active:translate-y-px",
  input: "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300",
  label: "text-xs font-semibold text-slate-600",
  badge: "inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700",
  tableHead: "text-left text-xs font-semibold text-slate-500",
  tableCell: "px-3 py-2.5 text-sm text-slate-800",
  skeleton: "animate-pulse bg-slate-200 rounded-lg",
};

// ---------- Layout ----------
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const title = useMemo(() => {
    if (location.pathname.startsWith("/customers")) return "Clientes";
    if (location.pathname.startsWith("/vehicles")) return "Vehículos";
    if (location.pathname.startsWith("/cities")) return "Ciudades";
    if (location.pathname.startsWith("/services")) return "Servicios";
    if (location.pathname.startsWith("/bookings")) return "Reservas";
    return "Panel";
  }, [location.pathname]);

  const primaryAction = useMemo(() => {
    if (location.pathname.startsWith("/customers")) return { label: "Nuevo cliente", to: "/customers/new" };
    if (location.pathname.startsWith("/vehicles")) return { label: "Nuevo vehículo", to: "/vehicles/new" };
    if (location.pathname.startsWith("/cities")) return { label: "Nueva ciudad", to: "/cities/new" };
    if (location.pathname.startsWith("/services")) return { label: "Nuevo servicio", to: "/services/new" };
    if (location.pathname.startsWith("/bookings")) return { label: "Nueva reserva", to: "/bookings/new" };
    return null;
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">G</span>
            <div className="leading-tight">
              <div className="text-sm font-semibold">GlassNou</div>
              <div className="text-xs text-slate-500">Ventas de vidrios de coche</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 w-[480px]">
            <input className={shell.input} placeholder="Buscar cliente, matrícula, modelo…" />
            <button className={shell.btn}>Buscar</button>
          </div>

          <div className="flex items-center gap-2">
            {primaryAction && (
              <button
                className={shell.btnPrimary}
                onClick={() => navigate(primaryAction.to)}
              >
                + {primaryAction.label}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className={`${shell.panel} rounded-2xl p-3 h-fit md:sticky md:top-20`}>
          <nav className="flex flex-col">
            {[
              { to: "/customers", label: "Clientes" },
              { to: "/vehicles", label: "Vehículos" },
              { to: "/services", label: "Servicios" },
              { to: "/bookings", label: "Reservas" },
              { to: "/cities", label: "Ciudades" },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-medium hover:bg-slate-100 ${
                    isActive ? "bg-slate-900 text-white" : "text-slate-700"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <Breadcrumbs />
          </div>

          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = parts.map((p, i) => ({
    label: p.replace(/\b\w/g, (c) => c.toUpperCase()),
    to: "/" + parts.slice(0, i + 1).join("/"),
  }));
  return (
    <nav className="text-xs text-slate-500">
      {crumbs.length ? (
        <ol className="flex items-center gap-1">
          <li>
            <NavLink to="/" className="hover:underline">Inicio</NavLink>
          </li>
          {crumbs.map((c, i) => (
            <li key={c.to} className="flex items-center gap-1">
              <span>/</span>
              {i === crumbs.length - 1 ? (
                <span className="text-slate-700 font-semibold">{c.label}</span>
              ) : (
                <NavLink className="hover:underline" to={c.to}>{c.label}</NavLink>
              )}
            </li>
          ))}
        </ol>
      ) : null}
    </nav>
  );
}

// ---------- Pages (examples) ----------
type Customer = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
};

function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Array<Customer>>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    // Simula carga inicial
    const t = setTimeout(() => {
      setRows([
        { id: 1, nombre: "Ana López", email: "ana@example.com", telefono: "+34 600 123 456", ciudad: "Barcelona" },
        { id: 2, nombre: "Carlos Ruiz", email: "carlos@example.com", telefono: "+34 611 987 321", ciudad: "Madrid" },
        { id: 3, nombre: "Marta Gil", email: "marta@example.com", telefono: "+34 622 555 999", ciudad: "Valencia" },
      ]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = rows.filter((r) =>
    [r.nombre, r.email, r.telefono, r.ciudad].some((v) => String(v).toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <section className="space-y-4">
      <div className={`${shell.card} p-3`}> 
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="w-full md:max-w-xs">
            <label className={shell.label}>Buscar</label>
            <input className={shell.input} placeholder="Nombre, email, teléfono…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button className={shell.btn}>Exportar CSV</button>
            <button className={shell.btn}>Importar</button>
          </div>
        </div>
      </div>

      <div className={`${shell.card} overflow-hidden`}>
        <table className="w-full table-fixed">
          <thead className="bg-slate-50">
            <tr>
              {["Nombre", "Email", "Teléfono", "Ciudad", ""].map((h) => (
                <th key={h} className={`px-3 py-2.5 ${shell.tableHead}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className={shell.tableCell}><div className={shell.skeleton + " h-5 w-3/4"} /></td>
                  ))}
                </tr>
              ))
            ) : filtered.length ? (
              filtered.map((r) => (
                <tr key={r.id} className="border-t hover:bg-slate-50/60">
                  <td className={shell.tableCell}><div className="font-medium">{r.nombre}</div></td>
                  <td className={shell.tableCell}>{r.email}</td>
                  <td className={shell.tableCell}>{r.telefono}</td>
                  <td className={shell.tableCell}><span className={shell.badge}>{r.ciudad}</span></td>
                  <td className={shell.tableCell}>
                    <div className="flex justify-end gap-2">
                      <button className={shell.btn}>Editar</button>
                      <button className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium border border-rose-200 text-rose-700 hover:bg-rose-50">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-10 text-center text-sm text-slate-500" colSpan={5}>
                  No hay resultados. Prueba limpiando filtros o crea un nuevo cliente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function VehiclesPage() {
  return (
    <section className="space-y-4">
      <div className={`${shell.card} p-4`}>
        <h2 className="text-sm font-semibold text-slate-600 mb-2">Filtros</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <label className={shell.label}>Marca</label>
            <input className={shell.input} placeholder="Ej. SEAT" />
          </div>
          <div>
            <label className={shell.label}>Modelo</label>
            <input className={shell.input} placeholder="Ej. León" />
          </div>
          <div>
            <label className={shell.label}>Año</label>
            <input className={shell.input} placeholder="2018" />
          </div>
          <div>
            <label className={shell.label}>Tipo de vidrio</label>
            <input className={shell.input} placeholder="Parabrisas / Lateral / Trasero" />
          </div>
        </div>
      </div>
      <EmptyState title="Sin resultados" subtitle="Ajusta los filtros para encontrar el vidrio correcto." actionLabel="Limpiar filtros" />
    </section>
  );
}

function ServicesPage() {
  return (
    <section className="space-y-4">
      <div className={`${shell.card} p-4`}>Define aquí tus servicios (sustitución, tintado, calibración ADAS, etc.).</div>
      <div className={`${shell.card} p-4`}>Tarifas y tiempos estándar por servicio.</div>
    </section>
  );
}

function BookingsPage() {
  return (
    <section className="space-y-4">
      <div className={`${shell.card} p-4`}>Calendario de reservas (pendiente de integrar).</div>
      <div className={`${shell.card} p-4`}>Lista de reservas con estado, cliente y vehículo.</div>
    </section>
  );
}

function CitiesPage() {
  return (
    <section className="space-y-4">
      <div className={`${shell.card} p-4`}>Ciudades de atención / talleres asociados.</div>
    </section>
  );
}

function EmptyState({ title, subtitle, actionLabel }: { title: string; subtitle: string; actionLabel?: string }) {
  return (
    <div className={`${shell.card} p-8 text-center`}>
      <div className="mx-auto mb-2 h-12 w-12 rounded-2xl bg-slate-100" />
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      {actionLabel && <div className="mt-4"><button className={shell.btn}>{actionLabel}</button></div>}
    </div>
  );
}

// ---------- App ----------
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<CustomersPage />} />
          <Route path="/customers/*" element={<CustomersPage />} />
          <Route path="/vehicles/*" element={<VehiclesPage />} />
          <Route path="/cities/*" element={<CitiesPage />} />
          <Route path="/services/*" element={<ServicesPage />} />
          <Route path="/bookings/*" element={<BookingsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
