import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Service } from '../types/service';
import ServiceForm from '../components/ServiceForm';

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ name: '', price: '', duration: '' });

  useEffect(() => {
    api.get<Service[]>('/api/services')
      .then((res) => {
        setServices(res.data);
        setIsLoading(false);
      });
  }, []);

  const handleCreated = (service: Service) => {
    setServices((prev) => [...prev, service]);
  };

  const handleDelete = (id: number) => {
    if (!confirm('¿Eliminar servicio?')) return;
    api.delete(`/api/services/${id}`).then(() => {
      setServices((prev) => prev.filter((s) => s.id !== id));
    });
  };

  const startEditing = (s: Service) => {
    setEditingId(s.id);
    setEditData({ name: s.name, price: String(s.price), duration: String(s.duration) });
  };

  const submitEdit = () => {
    if (!editingId) return;
    api.put<Service>(`/api/services/${editingId}`, {
      name: editData.name,
      price: parseFloat(editData.price),
      duration: parseInt(editData.duration),
    }).then((res) => {
      setServices((prev) =>
        prev.map((s) => (s.id === editingId ? res.data : s))
      );
      setEditingId(null);
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Servicios</h2>
      <ServiceForm onCreated={handleCreated} />

      {isLoading ? (
        <p className="text-gray-500">Cargando servicios...</p>
      ) : (
        <ul className="space-y-2">
          {services.map((s) => (
            <li key={s.id} className="border p-4 rounded shadow">
              {editingId === s.id ? (
                <>
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="border p-1 rounded w-full"
                  />
                  <input
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    className="border p-1 rounded w-full mt-1"
                  />
                  <input
                    value={editData.duration}
                    onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                    className="border p-1 rounded w-full mt-1"
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={submitEdit} className="bg-green-500 text-white px-3 py-1 rounded">Guardar</button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancelar</button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Nombre:</strong> {s.name}</p>
                  <p><strong>Precio:</strong> ${s.price.toFixed(2)}</p>
                  <p><strong>Duración:</strong> {s.duration} minutos</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => startEditing(s)} className="bg-yellow-500 text-white px-3 py-1 rounded">Editar</button>
                    <button onClick={() => handleDelete(s.id)} className="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
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
