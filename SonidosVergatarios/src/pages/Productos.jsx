import { useState } from 'react';
import ProductoCard from '../components/ProductoCard.jsx';
export default function Productos({ productos, alAgregar }) {
const [busqueda, setBusqueda] = useState('');
const visibles = productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
return <section><h1>Productos</h1><label htmlFor="buscar">Buscar producto</label>
<input id="buscar" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
<div className="grilla">{visibles.map(p => <ProductoCard key={p.id} producto={p} alAgregar={alAgregar}
/>)}</div>
</section>;
}