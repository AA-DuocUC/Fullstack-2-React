export default function Header({ cantidad = 0 }) {
    return (
        <header className="cabecera">
            <nav aria-label="Navegación principal">
                <a href="#/">SonidosVergatarios</a>
                <a href="#/productos">Productos</a>
                <a href="#/carrito">Carrito ({cantidad})</a>
            </nav>
        </header>
    );
}