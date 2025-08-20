import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Vehicle } from '../types/vehicle';
import VehicleForm from '../components/VehicleForm';

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    plate: '',
    brand: '',
    model: '',
    customerId: ''
  });

  useEffect(() => {
    api.get<Vehicle[]>('/vehicles')
      .then((res) => {
        setVehicles(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  const handleNewVehicle = (newVehicle: Vehicle) => {
    setVehicles((prev) => [...prev, newVehicle]);
  };

  const handleDelete = (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este vehículo?')) return;
    api.delete(`/vehicles/${id}`)
      .then(() => {
        setVehicles((prev) => prev.filter(v => v.id !== id));
      })
      .catch(() => alert('Error al eliminar el vehículo'));
  };

  const startEditing = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setEditForm({
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      customerId: String(vehicle.customerId)
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = () => {
    if (!editingId) return;

    api.put(`/vehicles/${editingId}`, {
      ...editForm,
      customerId: Number(editForm.customerId)
    }).then((res) => {
      setVehicles((prev) =>
        prev.map((v) => (v.id === editingId ? res.data : v))
      );
      setEditingId(null);
    }).catch(() => alert('Error al actualizar el vehículo'));
  };

  if (isLoading) return <p className="text-gray-500">Cargando vehículos...</p>;
  if (hasError) return <p className="text-red-500">No se pudo cargar la lista de vehículos</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Vehículos</h2>
      <VehicleForm onCreated={handleNewVehicle} />

      <ul className="space-y-2">
        {vehicles.map((vehicle) => (
          <li key={vehicle.id} className="border p-4 rounded shadow">
            {editingId === vehicle.id ? (
              <div className="space-y-2">
                <input
                  name="plate"
                  value={editForm.plate}
                  onChange={handleEditChange}
                  className="border p-1 rounded w-full"
                />
                <input
                  name="brand"
                  value={editForm.brand}
                  onChange={handleEditChange}
                  className="border p-1 rounded w-full"
                />
                <input
                  name="model"
                  value={editForm.model}
                  onChange={handleEditChange}
                  className="border p-1 rounded w-full"
                />
                <input
                  name="customerId"
                  value={editForm.customerId}
                  onChange={handleEditChange}
                  className="border p-1 rounded w-full"
                />
                <div className="flex gap-2">
                  <button onClick={submitEdit} className="bg-green-500 text-white px-3 py-1 rounded">Guardar</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <p><strong>Placa:</strong> {vehicle.plate}</p>
                <p><strong>Marca:</strong> {vehicle.brand}</p>
                <p><strong>Modelo:</strong> {vehicle.model}</p>
                <p><strong>ID Cliente:</strong> {vehicle.customerId}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => startEditing(vehicle)} className="bg-yellow-500 text-white px-3 py-1 rounded">Editar</button>
                  <button onClick={() => handleDelete(vehicle.id)} className="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
