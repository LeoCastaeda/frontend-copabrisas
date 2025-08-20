import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Booking } from '../types/booking';
import BookingForm from '../components/BookingForm';

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Booking[]>('/api/bookings')
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      });
  }, []);

  const handleCreated = (b: Booking) => {
    setBookings(prev => [...prev, b]);
  };

  const deleteBooking = (id: number) => {
    if (!confirm('¿Eliminar reserva?')) return;
    api.delete(`/api/bookings/${id}`).then(() => {
      setBookings(prev => prev.filter(b => b.id !== id));
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Reservas</h2>
      <BookingForm onCreated={handleCreated} />
      {loading ? <p className="text-gray-500">Cargando reservas...</p> : (
        <ul className="space-y-2">
          {bookings.map(b => (
            <li key={b.id} className="border p-4 rounded shadow">
              <p><strong>Fecha:</strong> {new Date(b.date).toLocaleString()}</p>
              <p><strong>Estado:</strong> {b.status}</p>
              <p><strong>ID Cliente:</strong> {b.customerId}</p>
              <p><strong>ID Ciudad:</strong> {b.cityId}</p>
              <p><strong>ID Servicio:</strong> {b.serviceId}</p>
              <p><strong>ID Vehículo:</strong> {b.vehicleId}</p>
              <button onClick={() => deleteBooking(b.id)} className="bg-red-600 text-white px-3 py-1 rounded mt-2">Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
