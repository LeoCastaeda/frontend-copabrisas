import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Review } from "../types/review";

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    api
      .get<Review[]>("/api/reviews")
      .then((res) => {
        setReviews(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar esta reseña?")) return;
    try {
      await api.delete(`/api/reviews/${id}`);
      setReviews((prev) => prev.filter((review) => review.id !== id));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Error al eliminar la reseña");
    }
  };

  if (isLoading) return <p className="text-gray-500">Cargando reseñas...</p>;
  if (hasError) return <p className="text-red-500">Error al cargar reseñas</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Reseñas de clientes</h2>
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="border rounded-lg p-4 shadow bg-white flex justify-between items-start"
          >
            <div>
              <p className="font-semibold">⭐ {review.rating}/5</p>
              <p className="text-gray-700">{review.content}</p>
              <p className="text-sm text-gray-500">
                Cliente ID: {review.customerId}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(review.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
