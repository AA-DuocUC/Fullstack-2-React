export const precioCLP = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor);

export const normalizar = (texto) =>
  String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export function estadoStock(stock) {
  if (stock <= 0) return { texto: 'Sin stock', variante: 'danger' };
  if (stock <= 3)
    return { texto: `Últimas ${stock} unidades`, variante: 'warning' };
  return { texto: 'Disponible', variante: 'success' };
}