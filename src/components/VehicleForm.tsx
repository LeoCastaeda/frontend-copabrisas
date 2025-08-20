import { useState } from 'react';
import api from '../api/axios';
import type { Vehicle } from '../types/vehicle';

interface Props {
  onCreated: (vehicle: Vehicle) => void;
}

export default function VehicleForm({ onCreated }: Props) {
  const [form, setForm] = useState({
    plate: '',
    brand: '',
    model: '',
    customerId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    api.post<Vehicle>('/vehicles', {
      ...form,
      customerId: Number(form.customerId)
    }).then((res) => {
      onCreated(res.data);
      setForm({ plate: '', brand: '', model: '', customerId: '' });
    }).catch(() => {
      alert('Error al crear vehículo');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div>
        <label className="block mb-1">Placa</label>
        <input name="plate" value={form.plate} onChange={handleChange} required className="border rounded p-2 w-full" />
      </div>
      <div>
        <label className="block mb-1">Marca</label>
        <input name="brand" value={form.brand} onChange={handleChange} required className="border rounded p-2 w-full" />
      </div>
      <div>
        <label className="block mb-1">Modelo</label>
        <input name="model" value={form.model} onChange={handleChange} required className="border rounded p-2 w-full" />
      </div>
      <div>
        <label className="block mb-1">ID del Cliente</label>
        <input name="customerId" value={form.customerId} onChange={handleChange} required className="border rounded p-2 w-full" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Crear vehículo</button>
    </form>
  );
}
