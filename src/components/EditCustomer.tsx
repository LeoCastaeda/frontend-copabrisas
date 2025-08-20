import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import type { Customer } from '../types/customer';

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/customers/${id}`)
      .then((res) => setCustomer(res.data))
      .catch(() => setError('No se pudo cargar el cliente'));
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    api.put(`/customers/${id}`, customer)
      .then(() => navigate('/customers'))
      .catch(() => setError('No se pudo actualizar el cliente'));
  };

  if (!customer) return <p>Cargando cliente...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Editar Cliente</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        className="border p-2 w-full"
        value={customer.name}
        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        placeholder="Nombre"
      />
      <input
        className="border p-2 w-full"
        value={customer.phone}
        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        placeholder="Teléfono"
      />
      <input
        className="border p-2 w-full"
        value={customer.email}
        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
        placeholder="Email"
      />
     
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
    </form>
  );
}
