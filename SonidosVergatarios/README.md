# SonidosVergatarios

Tienda de instrumentos musicales hecha con **React + Vite**. Es la migración a React del proyecto inicial de la Unidad 1 (Fullstack 2): catálogo con filtros, carrito con stock, compra simulada, contacto con validación y un panel de administración protegido por login.

## Tecnologías

- React 19, Vite 8 y React Router 7 (rutas sin `#`)
- React Bootstrap 2 / Bootstrap 5
- Swiper (carrusel de productos destacados)
- Vitest + Testing Library (pruebas)

## Cómo ejecutarlo

```bash
npm install
npm run dev          # servidor de desarrollo
npm run build        # versión de producción
npm run lint         # revisión de código
npm run test:run     # pruebas (una vez)
npm run test:coverage
```

## Acceso: un solo login con dos partes

Hay una única opción **Ingresar** en el menú. La página de acceso tiene dos pestañas:

- **Cliente**: iniciar sesión con correo o nombre de usuario, o **crear una cuenta** (nombre de usuario, correo, contraseña y confirmación). Al ingresar, el inicio muestra **"Bienvenido @tuusuario"** y el menú muestra "Hola, @tuusuario".
- **Administrador**: acceso al panel de productos.

| Parte | Usuario | Contraseña |
|-------|---------|------------|
| Administrador (demostración) | `admin` | `1234` |

Reglas de validación del registro: usuario de 3 a 20 caracteres (letras, números, `.`, `-`, `_`; no se permite `admin`/`administrador`/`root`), correo válido y no repetido, contraseña de 8 a 64 caracteres con al menos una letra y un número, y confirmación igual a la contraseña.

Permisos: un cliente puede comprar pero **no** entra a `/admin` (ve "Acceso restringido"); un visitante sin sesión que abre `/admin` es enviado al login. Las cuentas y la sesión se guardan en `localStorage`; las contraseñas se guardan ofuscadas (hash con sal), pero esto es solo una demostración académica: en una tienda real la autenticación debe hacerla un servidor.

## Funciones

- **Inicio**: portada, carrusel de productos y accesos rápidos.
- **Productos**: búsqueda por nombre y filtros por categoría, disponibilidad y precio máximo.
- **Carrito**: cantidades limitadas por stock, subtotal, envío simulado, total, vaciar y compra con confirmación (descuenta stock).
- **Contacto**: formulario validado en el navegador (no envía correo).
- **Admin** (requiere ser administrador): crear, editar y eliminar productos. Eliminar un producto también lo retira del carrito.
- Los productos, el carrito, las cuentas y la sesión se guardan en `localStorage`.

## Estructura

```
src/
  components/   Header, Footer, Layout, RutaAdmin, modales, tarjetas, carrusel
  context/      TiendaContext (catálogo y carrito) y AuthContext (sesión)
  pages/        Inicio, Productos, Carrito, Contacto, Login, Admin, NoEncontrada
  services/     almacen_tienda.js (lectura y escritura en localStorage)
  store/        TiendaVergataria.js (reducer: reglas de la tienda)
  utils/        formato.js y validaciones.js
  data/         productosIniciales.js
```

## Pruebas

`npm run test:run` ejecuta 85 pruebas en 4 archivos: reglas del reducer, validaciones y formato, persistencia y flujos completos de la interfaz (registro y login de clientes, login de administrador y permisos, catálogo, carrito, compra, Admin y contacto).

`public/_redirects` contiene la regla de fallback para hosting estático (Netlify), necesaria para recargar rutas como `/productos`.
