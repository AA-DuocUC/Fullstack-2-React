import { describe, expect, it, vi } from 'vitest';
import {
  cargarTienda,
  guardarTienda,
  cargarSesion,
  guardarSesion,
  CLAVES,
} from './almacen_tienda.js';
import { productosIniciales } from '../data/productosIniciales.js';

describe('persistencia', () => {
  it('recupera catálogo y carrito después de guardar', () => {
    const inicial = cargarTienda();
    inicial.carrito = [{ id: 1, cantidad: 2 }];
    expect(guardarTienda(inicial)).toBe(true);
    expect(cargarTienda().carrito).toEqual([{ id: 1, cantidad: 2 }]);
  });

  it('se recupera de JSON corrupto y estructuras inválidas', () => {
    localStorage.setItem(CLAVES.tienda, '{invalido');
    expect(cargarTienda().productos).toHaveLength(productosIniciales.length);
    localStorage.setItem(
      CLAVES.tienda,
      JSON.stringify({ productos: 'incorrecto', carrito: null }),
    );
    expect(cargarTienda().productos).toHaveLength(productosIniciales.length);
    expect(cargarTienda().carrito).toEqual([]);
  });

  it('limpia productos inexistentes, cantidades inválidas y filas duplicadas', () => {
    const inicial = cargarTienda();
    inicial.carrito = [
      { id: 1, cantidad: 2 },
      { id: 1, cantidad: 2 },
      { id: 99, cantidad: 1 },
      { id: 2, cantidad: -1 },
    ];
    guardarTienda(inicial);
    expect(cargarTienda().carrito).toEqual([{ id: 1, cantidad: 2 }]);
  });

  it('migra las claves de la primera entrega React', () => {
    const inicial = cargarTienda();
    localStorage.setItem(
      'SonidosVergatarios-react-productos',
      JSON.stringify(inicial.productos),
    );
    localStorage.setItem(
      'SonidosVergatarios-react-carrito',
      JSON.stringify([{ id: 2, cantidad: 3 }]),
    );
    expect(cargarTienda().carrito).toEqual([{ id: 2, cantidad: 3 }]);
  });

  it('informa si el navegador rechaza la escritura', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Sin espacio');
    });
    expect(guardarTienda(cargarTienda())).toBe(false);
    expect(guardarSesion({ usuario: 'admin', rol: 'admin' })).toBe(false);
  });

  it('guarda, recupera y elimina la sesión de administrador', () => {
    const sesion = { usuario: 'admin', rol: 'admin', nombre: 'Administrador' };
    expect(guardarSesion(sesion)).toBe(true);
    expect(cargarSesion()).toEqual(sesion);
    expect(guardarSesion(null)).toBe(true);
    expect(cargarSesion()).toBeNull();
  });

  it('descarta una sesión sin el rol académico permitido', () => {
    localStorage.setItem(
      CLAVES.sesion,
      JSON.stringify({ usuario: 'otro', rol: 'cliente' }),
    );
    expect(cargarSesion()).toBeNull();
  });
});
