import { describe, expect, it } from 'vitest';
import { validarContacto, validarProducto } from './validaciones.js';
import { estadoStock, normalizar, precioCLP } from './formato.js';

const valido = {
  nombre: 'Guitarra',
  categoria: 'Guitarras Acústicas',
  precio: '10000',
  stock: '0',
  imagen: 'https://example.com/guitarra.jpg',
};

describe('formularios', () => {
  it('acepta un producto válido incluso con stock cero', () => {
    expect(validarProducto(valido, [])).toEqual({});
  });

  it('informa todos los campos incorrectos en una misma validación', () => {
    expect(
      Object.keys(
        validarProducto(
          {
            nombre: ' ',
            categoria: 'x',
            precio: '',
            stock: '1.5',
            imagen: 'javascript:alert(1)',
          },
          [],
        ),
      ),
    ).toEqual(['nombre', 'categoria', 'precio', 'stock', 'imagen']);
  });

  it('permite conservar el nombre del producto al editarlo', () => {
    expect(validarProducto(valido, [{ ...valido, id: 1 }], 1)).toEqual({});
  });

  it('rechaza un nombre repetido al crear', () => {
    expect(validarProducto(valido, [{ ...valido, id: 1 }])).toHaveProperty(
      'nombre',
    );
  });

  it('muestra los tres errores de contacto sin detenerse en el primero', () => {
    expect(
      Object.keys(validarContacto({ email: 'mal', asunto: 'a', mensaje: 'b' })),
    ).toEqual(['email', 'asunto', 'mensaje']);
  });

  it('acepta un mensaje con caracteres válidos y rechaza un asunto demasiado largo', () => {
    expect(
      validarContacto({
        email: 'alumno@duoc.cl',
        asunto: 'Consulta por stock',
        mensaje: 'Necesito más información del producto.',
      }),
    ).toEqual({});
    expect(
      validarContacto({
        email: 'alumno@duoc.cl',
        asunto: 'a'.repeat(101),
        mensaje: 'Mensaje suficientemente largo.',
      }),
    ).toHaveProperty('asunto');
  });
});

describe('formato', () => {
  it('normaliza tildes, mayúsculas y espacios', () => {
    expect(normalizar('  GUÍTARRA Acústica ')).toBe('guitarra acustica');
  });

  it('muestra los precios en pesos chilenos sin decimales', () => {
    expect(precioCLP(129990).replace(/\s/g, ' ')).toMatch(/129\.990/);
  });

  it('clasifica el stock en agotado, últimas unidades y disponible', () => {
    expect(estadoStock(0).variante).toBe('danger');
    expect(estadoStock(3)).toEqual({
      texto: 'Últimas 3 unidades',
      variante: 'warning',
    });
    expect(estadoStock(8).variante).toBe('success');
  });
});
