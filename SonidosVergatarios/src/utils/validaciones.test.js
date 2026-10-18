import { describe, expect, it } from 'vitest';
import {
  validarContacto,
  validarLoginAdmin,
  validarLoginCliente,
  validarProducto,
  validarRegistro,
} from './validaciones.js';
import { estadoStock, normalizar, precioCLP } from './formato.js';
import { crearSal, hashClave } from './claves.js';

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

const registroValido = {
  usuario: 'abrahan',
  email: 'abrahan@correo.cl',
  contrasena: 'Guitarra123',
  confirmar: 'Guitarra123',
};

describe('registro de clientes', () => {
  it('acepta un registro válido', () => {
    expect(validarRegistro(registroValido, [])).toEqual({});
  });

  it('informa todos los errores a la vez y en orden', () => {
    expect(
      Object.keys(
        validarRegistro(
          { usuario: 'a', email: 'mal', contrasena: 'corta', confirmar: 'x' },
          [],
        ),
      ),
    ).toEqual(['usuario', 'email', 'contrasena', 'confirmar']);
  });

  it.each([
    ['ab', 'muy corto'],
    ['con espacios', 'con espacios'],
    ['a'.repeat(21), 'muy largo'],
    ['ñandú', 'con caracteres no permitidos'],
  ])('rechaza el usuario "%s" (%s)', (usuario) => {
    expect(validarRegistro({ ...registroValido, usuario }, [])).toHaveProperty(
      'usuario',
    );
  });

  it.each(['admin', 'ADMIN', 'Administrador', 'root'])(
    'reserva el nombre %s',
    (usuario) => {
      expect(
        validarRegistro({ ...registroValido, usuario }, []).usuario,
      ).toBe('Ese nombre de usuario no está disponible.');
    },
  );

  it.each([
    ['solonumeros1', true],
    ['12345678', false],
    ['sololetras', false],
    ['Ab1', false],
    ['a1'.repeat(33), false],
  ])('valida la contraseña %s', (contrasena, valida) => {
    const errores = validarRegistro(
      { ...registroValido, contrasena, confirmar: contrasena },
      [],
    );
    expect(Object.hasOwn(errores, 'contrasena')).toBe(!valida);
  });

  it('detecta usuario y correo repetidos sin distinguir mayúsculas', () => {
    const existentes = [{ usuario: 'Abrahan', email: 'ABRAHAN@correo.cl' }];
    const errores = validarRegistro(registroValido, existentes);
    expect(errores.usuario).toBe('Ese nombre de usuario no está disponible.');
    expect(errores.email).toBe('Ya existe una cuenta con ese correo.');
  });

  it('valida los formularios de ingreso', () => {
    expect(
      Object.keys(validarLoginCliente({ identificador: ' ', contrasena: '' })),
    ).toEqual(['identificador', 'contrasena']);
    expect(
      validarLoginCliente({ identificador: 'abrahan', contrasena: 'x' }),
    ).toEqual({});
    expect(
      Object.keys(validarLoginAdmin({ usuario: '', contrasena: '' })),
    ).toEqual(['usuario', 'contrasena']);
    expect(validarLoginAdmin({ usuario: 'admin', contrasena: '1234' })).toEqual(
      {},
    );
  });
});

describe('claves', () => {
  it('genera el mismo hash para la misma clave y sal, y no deja la clave a la vista', () => {
    const sal = crearSal();
    const hash = hashClave('Guitarra123', sal);
    expect(hashClave('Guitarra123', sal)).toBe(hash);
    expect(hash).not.toContain('Guitarra123');
  });

  it('cambia el hash con otra clave o con otra sal', () => {
    expect(hashClave('Guitarra123', 'a')).not.toBe(hashClave('Guitarra124', 'a'));
    expect(hashClave('Guitarra123', 'a')).not.toBe(hashClave('Guitarra123', 'b'));
    expect(crearSal()).not.toBe(crearSal());
  });
});
