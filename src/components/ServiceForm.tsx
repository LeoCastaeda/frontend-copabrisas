import { useState } from 'react';
import api from '../api/axios';
import type { Service } from '../types/service';

interface Props {
  onCreated: (service: Service) => void;
}

export default function ServiceForm({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post<Service>('/api/services', {
      name,
      price: parseFloat(price),
      duration: parseInt(duration),
    }).then((res) => {
      onCreated(res.data);
      setName('');
      setPrice('');
      setDuration('');
    }).catch(() => {
      alert('Error al crear el servicio');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-2">
      <input
        type="text"
        placeholder="Nombre del servicio"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <input
        type="number"
        placeholder="Duración (min)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
        Crear servicio
      </button>
    </form>
  );
}
