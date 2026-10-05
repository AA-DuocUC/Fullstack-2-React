import { useState } from 'react';
export default function ProductoCard({ producto }) {
    const [veces, setVeces] = useState(0);
    return (
        <article className="tarjeta">
            <img src={producto.imagen} alt={producto.nombre} />
            <h2>{producto.nombre}</h2>
            <strong>${producto.precio.toLocaleString('es-CL')}</strong>
            <p>Stock: {producto.stock}</p>
            <button type="button" onClick={() => setVeces(actual => actual + 1)}>
                Probar clic
            </button>
            <p>Has pulsado {veces} veces esta tarjeta.</p>
        </article>
    );
}