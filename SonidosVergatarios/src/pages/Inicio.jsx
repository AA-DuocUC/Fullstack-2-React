import { Link } from 'react-router';

export default function Inicio() {
    return (
        <section>
            <h1>Bienvenido a SonidosVergatarios</h1>
            <p>Tu tienda de productos musicales favorita y vergataria.</p>
            <Link to="/productos">Explorar productos</Link>
        </section>
    );
}