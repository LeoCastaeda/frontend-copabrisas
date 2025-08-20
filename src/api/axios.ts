

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export default api;
// Cambia la URL base según tu backend
// Puedes agregar más configuraciones si es necesario, como headers personalizados  or interceptors
// Ejemplo de configuración de headers