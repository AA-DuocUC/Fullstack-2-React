import { describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import App from './App.jsx';
import { CLAVES } from './services/almacen_tienda.js';
import { productosIniciales } from './data/productosIniciales.js';

const primero = productosIniciales[0]; // Guitarra Acústica Folk (stock 8)

function renderApp(ruta = '/') {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  );
}

function admin() {
  localStorage.setItem(
    CLAVES.sesion,
    JSON.stringify({ usuario: 'admin', rol: 'admin' }),
  );
}

async function rellenarProducto(user, nombre = 'Ukelele Soprano') {
  await user.type(screen.getByLabelText('Nombre del producto'), nombre);
  await user.type(screen.getByLabelText('Categoría del producto'), 'Ukeleles');
  await user.type(screen.getByLabelText('Precio'), '15000');
  await user.type(screen.getByLabelText('Stock'), '3');
  await user.type(
    screen.getByLabelText('URL de imagen'),
    'https://example.com/ukelele.jpg',
  );
}

describe('navegación y acceso', () => {
  it('cambia de página mediante NavLink y marca el enlace activo', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(
      screen.getByRole('link', { name: 'Productos', exact: true }),
    );
    expect(
      await screen.findByRole('heading', { name: 'Catálogo de productos' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Productos', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
  });

  it('muestra una página 404 para direcciones desconocidas', () => {
    renderApp('/ruta-inexistente');
    expect(
      screen.getByRole('heading', { name: 'Página no encontrada' }),
    ).toBeInTheDocument();
  });

  it('redirige Admin a login, rechaza una contraseña incorrecta y permite entrar y salir', async () => {
    const user = userEvent.setup();
    renderApp('/admin');

    expect(
      await screen.findByRole('heading', {
        name: 'Inicio de sesión administrador',
      }),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText('Usuario'), 'admin');
    await user.type(screen.getByLabelText('Contraseña'), 'incorrecta');
    await user.click(
      screen.getByRole('button', { name: 'Ingresar', exact: true }),
    );
    expect(
      await screen.findByText('Usuario o contraseña incorrectos.'),
    ).toBeInTheDocument();

    await user.clear(screen.getByLabelText('Contraseña'));
    await user.type(screen.getByLabelText('Contraseña'), '1234');
    await user.click(
      screen.getByRole('button', { name: 'Ingresar', exact: true }),
    );
    expect(
      await screen.findByRole('heading', {
        name: 'Administración de productos',
      }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem(CLAVES.sesion)).rol).toBe('admin'),
    );

    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    await user.click(screen.getByRole('link', { name: 'Admin', exact: true }));
    expect(
      await screen.findByRole('heading', {
        name: 'Inicio de sesión administrador',
      }),
    ).toBeInTheDocument();
    expect(localStorage.getItem(CLAVES.sesion)).toBeNull();
  });

  it('restaura la sesión al volver a montar la aplicación', () => {
    admin();
    renderApp('/admin');
    expect(
      screen.getByRole('heading', { name: 'Administración de productos' }),
    ).toBeInTheDocument();
  });

  it('lleva al panel si ya hay sesión y se abre el login', () => {
    admin();
    renderApp('/login');
    expect(
      screen.getByRole('heading', { name: 'Administración de productos' }),
    ).toBeInTheDocument();
  });
});

describe('catálogo y carrito visibles', () => {
  it('combina búsqueda, categoría, disponibilidad y precio y puede limpiar filtros', async () => {
    const user = userEvent.setup();
    renderApp('/productos');

    await user.type(screen.getByLabelText('Buscar producto'), 'guitarra');
    await user.selectOptions(
      screen.getByLabelText('Categoría'),
      'Guitarras Eléctricas',
    );
    await user.selectOptions(
      screen.getByLabelText('Disponibilidad'),
      'disponible',
    );
    await user.type(screen.getByLabelText('Precio máximo'), '300000');
    // Stratocaster ($249.990) y Telecaster ($239.990)
    expect(screen.getAllByRole('article')).toHaveLength(2);

    await user.clear(screen.getByLabelText('Precio máximo'));
    await user.type(screen.getByLabelText('Precio máximo'), '0');
    expect(
      screen.getByText('No encontramos productos con esos filtros.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(screen.getAllByRole('article')).toHaveLength(
      productosIniciales.length,
    );
  });

  it('impide agregar un producto agotado desde la interfaz', () => {
    localStorage.setItem(
      CLAVES.tienda,
      JSON.stringify({ productos: [{ ...primero, stock: 0 }], carrito: [] }),
    );
    renderApp('/productos');
    expect(screen.getByRole('button', { name: 'Sin stock' })).toBeDisabled();
  });

  it('agrega, cambia cantidades, cancela una compra y finalmente descuenta stock', async () => {
    const user = userEvent.setup();
    renderApp('/productos');

    await user.click(
      screen.getAllByRole('button', { name: 'Agregar al carrito' })[0],
    );
    await user.click(screen.getByRole('link', { name: 'Carrito (1)' }));
    await user.click(
      screen.getByRole('button', {
        name: `Agregar una unidad de ${primero.nombre}`,
      }),
    );
    expect(
      screen.getByLabelText(`Cantidad de ${primero.nombre}`),
    ).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: 'Finalizar compra' }));
    let dialogo = await screen.findByRole('dialog', {
      name: 'Confirmar compra',
    });
    await user.click(within(dialogo).getByRole('button', { name: 'Cancelar' }));
    expect(
      screen.getByLabelText(`Cantidad de ${primero.nombre}`),
    ).toHaveTextContent('2');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );

    await user.click(screen.getByRole('button', { name: 'Finalizar compra' }));
    dialogo = await screen.findByRole('dialog', { name: 'Confirmar compra' });
    await user.click(
      within(dialogo).getByRole('button', { name: 'Confirmar', exact: true }),
    );
    expect(
      await screen.findByText('Tu carrito está vacío.'),
    ).toBeInTheDocument();

    await waitFor(() => {
      const datos = JSON.parse(localStorage.getItem(CLAVES.tienda));
      expect(datos.productos.find((p) => p.id === 1).stock).toBe(
        primero.stock - 2,
      );
      expect(datos.carrito).toEqual([]);
    });
  });

  it('conserva el carrito al desmontar y volver a montar la aplicación', async () => {
    const user = userEvent.setup();
    const vista = renderApp('/productos');
    await user.click(
      screen.getAllByRole('button', { name: 'Agregar al carrito' })[0],
    );
    vista.unmount();
    renderApp('/carrito');
    expect(
      screen.getByLabelText(`Cantidad de ${primero.nombre}`),
    ).toHaveTextContent('1');
    await user.click(
      screen.getByRole('button', { name: `Eliminar ${primero.nombre}` }),
    );
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
  });

  it('permite vaciar el carrito mediante confirmación', async () => {
    localStorage.setItem(
      CLAVES.tienda,
      JSON.stringify({
        productos: productosIniciales,
        carrito: [{ id: 1, cantidad: 1 }],
      }),
    );
    const user = userEvent.setup();
    renderApp('/carrito');
    await user.click(screen.getByRole('button', { name: 'Vaciar carrito' }));
    const dialogo = await screen.findByRole('dialog', {
      name: 'Vaciar carrito',
    });
    await user.click(
      within(dialogo).getByRole('button', { name: 'Confirmar', exact: true }),
    );
    expect(
      await screen.findByText('Tu carrito está vacío.'),
    ).toBeInTheDocument();
  });
});

describe('administración y contacto', () => {
  it('crea y edita un producto mediante el formulario del modal', async () => {
    admin();
    const user = userEvent.setup();
    renderApp('/admin');

    await user.click(
      screen.getByRole('button', { name: 'Nuevo producto', exact: true }),
    );
    await rellenarProducto(user);
    await user.click(screen.getByRole('button', { name: 'Guardar producto' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole('button', { name: 'Editar Ukelele Soprano' }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Editar Ukelele Soprano' }),
    );
    await user.clear(screen.getByLabelText('Precio'));
    await user.type(screen.getByLabelText('Precio'), '20000');
    await user.click(screen.getByRole('button', { name: 'Guardar producto' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );

    const fila = screen.getByRole('row', { name: /Ukelele Soprano/ });
    expect(within(fila).getByText(/20\.000/)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(CLAVES.tienda)).productos).toHaveLength(
      productosIniciales.length + 1,
    );
  });

  it('muestra errores de formulario y rechaza un nombre duplicado', async () => {
    admin();
    const user = userEvent.setup();
    renderApp('/admin');

    await user.click(
      screen.getByRole('button', { name: 'Nuevo producto', exact: true }),
    );
    await user.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(
      screen.getByText('El precio debe ser mayor que cero.'),
    ).toBeInTheDocument();

    await rellenarProducto(user, primero.nombre);
    await user.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(
      screen.getByText('Ya existe un producto con ese nombre.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('dialog', { name: 'Nuevo producto' }),
    ).toBeInTheDocument();
  });

  it('cancela y confirma la eliminación, retirando el producto del carrito', async () => {
    admin();
    localStorage.setItem(
      CLAVES.tienda,
      JSON.stringify({
        productos: productosIniciales,
        carrito: [{ id: 1, cantidad: 1 }],
      }),
    );
    const user = userEvent.setup();
    renderApp('/admin');

    await user.click(
      screen.getByRole('button', { name: `Eliminar ${primero.nombre}` }),
    );
    let dialogo = await screen.findByRole('dialog', {
      name: 'Eliminar producto',
    });
    await user.click(within(dialogo).getByRole('button', { name: 'Cancelar' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole('button', { name: `Editar ${primero.nombre}` }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: `Eliminar ${primero.nombre}` }),
    );
    dialogo = await screen.findByRole('dialog', { name: 'Eliminar producto' });
    await user.click(
      within(dialogo).getByRole('button', { name: 'Confirmar', exact: true }),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: `Editar ${primero.nombre}` }),
      ).not.toBeInTheDocument(),
    );
    expect(JSON.parse(localStorage.getItem(CLAVES.tienda)).carrito).toEqual([]);
  });

  it('valida contacto y muestra una confirmación local', async () => {
    const user = userEvent.setup();
    renderApp('/contacto');

    await user.click(screen.getByRole('button', { name: 'Validar mensaje' }));
    expect(
      screen.getByText('Ingresa un correo electrónico válido.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('El asunto debe tener entre 5 y 100 caracteres válidos.'),
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText('Correo electrónico'),
      'alumno@duoc.cl',
    );
    await user.type(screen.getByLabelText('Asunto'), 'Consulta por stock');
    await user.type(
      screen.getByLabelText('Mensaje'),
      'Quiero conocer el stock de un instrumento.',
    );
    await user.click(screen.getByRole('button', { name: 'Validar mensaje' }));
    expect(
      await screen.findByText('Mensaje validado correctamente.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('');
  });
});
