import { precioCLP } from '../utils/formato.js';

export default function Carrito({ productos, carrito, quitar, cambiarCantidad }) {
    const detalle = carrito.map(item => ({ ...productos.find(p => p.id === item.id), cantidad: item.cantidad }));
    const total = detalle.reduce((suma, p) => suma + p.precio * p.cantidad, 0);
    return <section><h1>Mi carrito</h1>
        {!detalle.length && <p>Tu carrito está vacío.</p>}
        {detalle.map(p => (
            <p key={p.id}>
                {p.nombre}: {p.cantidad} unidades{' '}
                <button
                    aria-label={`Quitar una unidad de ${p.nombre}`}
                    onClick={() => cambiarCantidad(p.id, p.cantidad - 1)}
                >−</button>
                <button
                    aria-label={`Agregar una unidad de ${p.nombre}`}
                    onClick={() => cambiarCantidad(p.id, p.cantidad + 1)}
                >+</button>
                <button onClick={() => quitar(p.id)}>Eliminar {p.nombre}</button>
            </p>
        ))}
        <p>Total sin envío: {precioCLP(total)}</p>
        <a href="#/productos">Continuar comprando</a>
    </section>;
}