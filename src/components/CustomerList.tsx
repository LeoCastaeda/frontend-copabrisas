import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Customer } from '../types/customer';

export default function CustomerList() {
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get<Customer[]>('/customers')
      .then((response) => {
        setCustomersData(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  const handleDelete = (id: number) => {
    const confirmDelete = confirm('¿Estás seguro de eliminar este cliente?');
    if (!confirmDelete) return;

    api.delete(`/customers/${id}`)
      .then(() => {
        setCustomersData(customersData.filter(c => c.id !== id));
      })
      .catch(() => {
        alert('No se pudo eliminar el cliente');
      });
  };

  if (isLoading) return <p className="text-gray-500">Cargando clientes...</p>;
  if (hasError) return <p className="text-red-500">No se pudo cargar la lista de clientes</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Clientes</h2>
      <ul className="space-y-2">
        {customersData.map((customer) => (
          <li key={customer.id} className="border p-4 rounded shadow">
            <p><strong>Nombre:</strong> {customer.name}</p>
            <p><strong>Correo:</strong> {customer.email}</p>
            <p><strong>Teléfono:</strong> {customer.phone}</p>
            <p><strong>Fecha de registro:</strong> {new Date(customer.createdAt).toLocaleDateString()}</p>
            <div className="mt-2 flex gap-4">
              <button
                onClick={() => navigate(`/customers/edit/${customer.id}`)}
                className="text-blue-600 hover:underline"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(customer.id)}
                className="text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
