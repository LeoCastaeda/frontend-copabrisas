import { useState } from "react";
import api from "../api/axios";
import type { Booking } from "../types/booking";
import type { AxiosError } from "axios";

type ApiError = { message?: string; detail?: string };

export default function BookingForm({ onCreated }: { onCreated: (b: Booking) => void }) {
  const [form, setForm] = useState({ status: "confirmed", customerId: "", cityId: "", serviceId: "", vehicleId: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const payload = {
        status: form.status,
        customerId: Number(form.customerId),
        cityId: Number(form.cityId),
        serviceId: Number(form.serviceId),
        vehicleId: Number(form.vehicleId),
      };
      const { data } = await api.post<Booking>("/api/bookings", payload);
      onCreated(data);
      setForm({ status: "confirmed", customerId: "", cityId: "", serviceId: "", vehicleId: "" });
    } catch (error) {
      const ax = error as AxiosError<ApiError>;
      setErr(ax.response?.data?.message ?? ax.response?.data?.detail ?? ax.message ?? "No se pudo crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          name="status"
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          className="border p-2 rounded"
        >
          <option value="confirmed">Confirmada</option>
          <option value="pending">Pendiente</option>
          <option value="cancelled">Cancelada</option>
        </select>

        <input
          name="customerId"
          type="number"
          placeholder="ID Cliente"
          value={form.customerId}
          onChange={(e) => setForm((f) => ({ ...f, customerId: e.target.value }))}
          className="border p-2 rounded"
          required
        />
        <input
          name="cityId"
          type="number"
          placeholder="ID Ciudad"
          value={form.cityId}
          onChange={(e) => setForm((f) => ({ ...f, cityId: e.target.value }))}
          className="border p-2 rounded"
          required
        />
        <input
          name="serviceId"
          type="number"
          placeholder="ID Servicio"
          value={form.serviceId}
          onChange={(e) => setForm((f) => ({ ...f, serviceId: e.target.value }))}
          className="border p-2 rounded"
          required
        />
        <input
          name="vehicleId"
          type="number"
          placeholder="ID Vehículo"
          value={form.vehicleId}
          onChange={(e) => setForm((f) => ({ ...f, vehicleId: e.target.value }))}
          className="border p-2 rounded"
          required
        />
      </div>

      {err && <p className="text-red-600 text-sm">{err}</p>}

      <button disabled={loading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">
        {loading ? "Creando..." : "Crear reserva"}
      </button>
    </form>
  );
}
