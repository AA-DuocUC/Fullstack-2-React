import { precioCLP } from '../utils/formato.js';
export default function ProductoCard({ producto, alAgregar }) {
return <article><img src={producto.imagen} alt={producto.nombre} />
<h2>{producto.nombre}</h2><p>{precioCLP(producto.precio)}</p>
<p>Stock: {producto.stock}</p>
<button disabled={producto.stock === 0} onClick={() => alAgregar(producto.id)}>Agregar al carrito</button>
</article>;
}