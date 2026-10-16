import { describe, expect, it } from 'vitest';
import {
  crearEstado,
  tiendaReducer,
} from './TiendaVergataria.js';

const producto = {
  id: 1,
  nombre: 'Guitarra Acustica',
  precio: 150000,
  stock: 2,
  categoria: 'Cuerdas',
  imagen: 'https://example.com/guitarra.jpg',
};
const iniciar = () => crearEstado([{ ...producto }]);

describe('reglas del carrito y tienda', () => {
  it('acumula cantidades sin duplicar productos', () => {
    const inicial = iniciar();
    const uno = tiendaReducer(inicial, { type: 'AGREGAR', id: 1 });
    const dos = tiendaReducer(uno, { type: 'AGREGAR', id: 1 });
    expect(dos.carrito).toEqual([{ id: 1, cantidad: 2 }]);
  });

  it('descuenta stock y vacía el carrito al comprar', () => {
    const inicial = crearEstado([producto], [{ id: 1, cantidad: 2 }]);
    const compra = tiendaReducer(inicial, { type: 'COMPRAR' });
    expect(compra.productos[0].stock).toBe(0);
    expect(compra.carrito).toEqual([]);
  });
});