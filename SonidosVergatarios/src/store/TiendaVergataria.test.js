import { describe, expect, it } from 'vitest';
import {
  crearEstado,
  tiendaReducer,
  detalleCarrito,
  resumenCarrito,
} from './TiendaVergataria.js';

const producto = {
  id: 1,
  nombre: 'Guitarra Acústica',
  precio: 10000,
  stock: 2,
  categoria: 'Guitarras Acústicas',
  imagen: 'https://example.com/guitarra.jpg',
};
const iniciar = () => crearEstado([{ ...producto }]);

describe('reglas del carrito', () => {
  it('acumula cantidades sin duplicar productos ni mutar el estado anterior', () => {
    const inicial = iniciar();
    const uno = tiendaReducer(inicial, { type: 'AGREGAR', id: 1 });
    const dos = tiendaReducer(uno, { type: 'AGREGAR', id: 1 });
    expect(dos.carrito).toEqual([{ id: 1, cantidad: 2 }]);
    expect(inicial.carrito).toEqual([]);
    expect(inicial.productos[0].stock).toBe(2);
  });

  it('rechaza agregar más unidades que el stock disponible', () => {
    const inicial = crearEstado([producto], [{ id: 1, cantidad: 2 }]);
    const siguiente = tiendaReducer(inicial, { type: 'AGREGAR', id: 1 });
    expect(siguiente.carrito).toEqual(inicial.carrito);
    expect(siguiente.aviso.tipo).toBe('warning');
  });

  it('impide agregar productos sin stock o que no existen', () => {
    const inicial = crearEstado([{ ...producto, stock: 0 }]);
    expect(tiendaReducer(inicial, { type: 'AGREGAR', id: 1 }).carrito).toEqual(
      [],
    );
    expect(tiendaReducer(inicial, { type: 'AGREGAR', id: 99 }).carrito).toEqual(
      [],
    );
  });

  it.each([-1, 1.5, 3, NaN])('rechaza la cantidad inválida %s', (cantidad) => {
    const inicial = crearEstado([producto], [{ id: 1, cantidad: 1 }]);
    expect(
      tiendaReducer(inicial, { type: 'CANTIDAD', id: 1, cantidad }).carrito,
    ).toEqual(inicial.carrito);
  });

  it('retira un producto si su cantidad llega a cero', () => {
    const inicial = crearEstado([producto], [{ id: 1, cantidad: 1 }]);
    expect(
      tiendaReducer(inicial, { type: 'CANTIDAD', id: 1, cantidad: 0 }).carrito,
    ).toEqual([]);
  });

  it('quita un producto y vacía el carrito', () => {
    const inicial = crearEstado([producto], [{ id: 1, cantidad: 1 }]);
    expect(tiendaReducer(inicial, { type: 'QUITAR', id: 1 }).carrito).toEqual(
      [],
    );
    expect(tiendaReducer(inicial, { type: 'VACIAR' }).carrito).toEqual([]);
  });

  it('calcula subtotal, envío y total usando cantidad', () => {
    expect(
      resumenCarrito(crearEstado([producto], [{ id: 1, cantidad: 2 }])),
    ).toEqual({ subtotal: 20000, envio: 3990, total: 23990, unidades: 2 });
    expect(resumenCarrito(iniciar())).toEqual({
      subtotal: 0,
      envio: 0,
      total: 0,
      unidades: 0,
    });
  });

  it('descuenta stock y vacía el carrito al comprar', () => {
    const inicial = crearEstado([producto], [{ id: 1, cantidad: 2 }]);
    const compra = tiendaReducer(inicial, { type: 'COMPRAR' });
    expect(compra.productos[0].stock).toBe(0);
    expect(compra.carrito).toEqual([]);
    expect(inicial.productos[0].stock).toBe(2);
  });

  it('rechaza comprar con el carrito vacío', () => {
    const resultado = tiendaReducer(iniciar(), { type: 'COMPRAR' });
    expect(resultado.aviso.tipo).toBe('warning');
  });

  it('rechaza una compra completa si un producto perdió stock', () => {
    const inicial = crearEstado(
      [producto, { ...producto, id: 2, nombre: 'Bajo', stock: 0 }],
      [
        { id: 1, cantidad: 1 },
        { id: 2, cantidad: 1 },
      ],
    );
    const rechazado = tiendaReducer(inicial, { type: 'COMPRAR' });
    expect(rechazado.productos).toEqual(inicial.productos);
    expect(rechazado.carrito).toEqual(inicial.carrito);
    expect(rechazado.aviso.tipo).toBe('danger');
  });

  it('cierra el aviso y conserva el estado ante acciones desconocidas', () => {
    const conAviso = tiendaReducer(iniciar(), { type: 'VACIAR' });
    expect(tiendaReducer(conAviso, { type: 'CERRAR_AVISO' }).aviso).toBeNull();
    expect(tiendaReducer(conAviso, { type: 'NO_EXISTE' })).toBe(conAviso);
  });
});

describe('reglas del CRUD', () => {
  it('crea un producto con id único y convierte números del formulario', () => {
    const nuevo = {
      ...producto,
      nombre: 'Bajo Eléctrico',
      precio: '15000',
      stock: '4',
    };
    const resultado = tiendaReducer(iniciar(), {
      type: 'GUARDAR_PRODUCTO',
      id: null,
      datos: nuevo,
    });
    expect(resultado.productos[1]).toMatchObject({
      id: 2,
      nombre: 'Bajo Eléctrico',
      precio: 15000,
      stock: 4,
    });
  });

  it('guarda marca y descripción cuando el formulario las envía', () => {
    const resultado = tiendaReducer(iniciar(), {
      type: 'GUARDAR_PRODUCTO',
      id: null,
      datos: {
        ...producto,
        nombre: 'Ukelele Soprano',
        marca: ' Kala ',
        descripcion: 'Ideal para empezar.',
      },
    });
    expect(resultado.productos[1]).toMatchObject({
      marca: 'Kala',
      descripcion: 'Ideal para empezar.',
    });
  });

  it('actualiza el precio manteniendo el id y el carrito consulta ese precio', () => {
    const inicial = crearEstado([producto], [{ id: 1, cantidad: 2 }]);
    const resultado = tiendaReducer(inicial, {
      type: 'GUARDAR_PRODUCTO',
      id: 1,
      datos: { ...producto, precio: 15000 },
    });
    expect(resultado.productos).toHaveLength(1);
    expect(detalleCarrito(resultado)[0].precio).toBe(15000);
    expect(resumenCarrito(resultado).subtotal).toBe(30000);
  });

  it('al editar conserva los campos que el formulario no envía', () => {
    const inicial = crearEstado([{ ...producto, marca: 'Yamaha' }]);
    const resultado = tiendaReducer(inicial, {
      type: 'GUARDAR_PRODUCTO',
      id: 1,
      datos: { ...producto, precio: 12000 },
    });
    expect(resultado.productos[0].marca).toBe('Yamaha');
  });

  it('rechaza duplicados normalizados y precios no válidos', () => {
    const inicial = iniciar();
    const duplicado = tiendaReducer(inicial, {
      type: 'GUARDAR_PRODUCTO',
      id: null,
      datos: { ...producto, nombre: ' GUÍTARRA acústica ' },
    });
    const negativo = tiendaReducer(inicial, {
      type: 'GUARDAR_PRODUCTO',
      id: null,
      datos: { ...producto, nombre: 'Otra guitarra', precio: -1 },
    });
    expect(duplicado.productos).toEqual(inicial.productos);
    expect(negativo.productos).toEqual(inicial.productos);
  });

  it('no edita un producto que ya no existe', () => {
    const inicial = iniciar();
    const resultado = tiendaReducer(inicial, {
      type: 'GUARDAR_PRODUCTO',
      id: 99,
      datos: { ...producto, nombre: 'Fantasma' },
    });
    expect(resultado.productos).toEqual(inicial.productos);
    expect(resultado.aviso.tipo).toBe('warning');
  });

  it('elimina el producto tanto del catálogo como del carrito', () => {
    const inicial = crearEstado([producto], [{ id: 1, cantidad: 1 }]);
    const resultado = tiendaReducer(inicial, {
      type: 'ELIMINAR_PRODUCTO',
      id: 1,
    });
    expect(resultado.productos).toEqual([]);
    expect(resultado.carrito).toEqual([]);
  });
});
