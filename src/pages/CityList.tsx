import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { City } from '../types/city';
import CityForm from '../components/CityForm';

export default function CityList() {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    api.get<City[]>('/api/cities')
      .then((res) => {
        setCities(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleCreated = (city: City) => {
    setCities((prev) => [...prev, city]);
  };

  const handleDelete = (id: number) => {
    if (!confirm('¿Eliminar ciudad?')) return;
    api.delete(`/api/cities/${id}`).then(() => {
      setCities((prev) => prev.filter((c) => c.id !== id));
    });
  };

  const startEditing = (city: City) => {
    setEditingId(city.id);
    setEditName(city.name);
  };

  const submitEdit = () => {
    if (!editingId) return;
    api.put<City>(`/api/cities/${editingId}`, { name: editName })
      .then((res) => {
        setCities((prev) =>
          prev.map((c) => (c.id === editingId ? res.data : c))
        );
        setEditingId(null);
        setEditName('');
      })
      .catch(() => alert('Error al actualizar la ciudad'));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Ciudades</h2>
      <CityForm onCreated={handleCreated} />

      {isLoading ? (
        <p className="text-gray-500">Cargando ciudades...</p>
      ) : (
        <ul className="space-y-2">
          {cities.map((city) => (
            <li key={city.id} className="border p-4 rounded shadow">
              {editingId === city.id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={submitEdit} className="bg-green-500 text-white px-3 py-1 rounded">Guardar</button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancelar</button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Ciudad:</strong> {city.name}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => startEditing(city)} className="bg-yellow-500 text-white px-3 py-1 rounded">Editar</button>
                    <button onClick={() => handleDelete(city.id)} className="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
