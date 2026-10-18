import { describe, expect, it, vi } from 'vitest';
import {
  cargarTienda,
  guardarTienda,
  cargarSesion,
  guardarSesion,
  cargarUsuarios,
  guardarUsuarios,
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

  it('descarta una sesión de cliente cuya cuenta ya no existe', () => {
    localStorage.setItem(
      CLAVES.sesion,
      JSON.stringify({ usuario: 'fantasma', rol: 'cliente' }),
    );
    expect(cargarSesion()).toBeNull();
  });
});

describe('cuentas de usuario', () => {
  const cuenta = (usuario) => ({
    id: 1,
    usuario,
    email: `${usuario}@correo.cl`,
    sal: 's',
    clave: 'h',
  });

  it('guarda y recupera las cuentas', () => {
    expect(guardarUsuarios([cuenta('abrahan')])).toBe(true);
    expect(cargarUsuarios()).toEqual([cuenta('abrahan')]);
  });

  it('descarta cuentas inválidas o repetidas y se recupera de JSON corrupto', () => {
    localStorage.setItem(
      CLAVES.usuarios,
      JSON.stringify([
        cuenta('ana'),
        cuenta('ANA'),
        { usuario: 'sinclave' },
        null,
      ]),
    );
    expect(cargarUsuarios()).toEqual([cuenta('ana')]);
    localStorage.setItem(CLAVES.usuarios, '{roto');
    expect(cargarUsuarios()).toEqual([]);
    localStorage.setItem(CLAVES.usuarios, JSON.stringify({ no: 'lista' }));
    expect(cargarUsuarios()).toEqual([]);
  });

  it('acepta una sesión de cliente solo si la cuenta existe', () => {
    guardarUsuarios([cuenta('abrahan')]);
    const sesion = { usuario: 'abrahan', rol: 'cliente', nombre: 'abrahan' };
    guardarSesion(sesion);
    expect(cargarSesion()).toEqual(sesion);
  });

  it('informa si el navegador rechaza guardar las cuentas', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Sin espacio');
    });
    expect(guardarUsuarios([cuenta('abrahan')])).toBe(false);
  });
});
