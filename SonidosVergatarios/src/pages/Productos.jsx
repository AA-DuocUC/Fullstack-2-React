import { useState } from 'react';
import ProductoCard from '../components/ProductoCard.jsx';
import { productosIniciales } from '../data/productosIniciales.js';
export default function Productos() {
    const [busqueda, setBusqueda] = useState('');
    const visibles = productosIniciales.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    return (
        <section>
            <h1>Productos</h1>
            <label htmlFor="busqueda">Buscar producto</label>
            <input id="busqueda" value={busqueda}
                onChange={evento => setBusqueda(evento.target.value)} />
            <p>{visibles.length} resultados</p>
            <div className="grilla">
                {visibles.map(producto =>
                    <ProductoCard key={producto.id} producto={producto} />)}
            </div>
        </section>
    );
}