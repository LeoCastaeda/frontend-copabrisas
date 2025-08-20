import { useState } from 'react';
import api from '../api/axios';
import type { City } from '../types/city';

interface Props {
  onCreated: (city: City) => void;
}

export default function CityForm({ onCreated }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post<City>('/api/cities', { name })
      .then((res) => {
        onCreated(res.data);
        setName('');
      })
      .catch(() => alert('No se pudo crear la ciudad'));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-2">
      <input
        type="text"
        placeholder="Nombre de la ciudad"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
        Crear ciudad
      </button>
    </form>
  );
}
