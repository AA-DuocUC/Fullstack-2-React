import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { precioCLP, estadoStock } from '../utils/formato.js';
import { useTienda } from '../context/TiendaContext.jsx';

export default function CarruselProductos({ cantidad = 6 }) {
  const { estado } = useTienda();
  const swiperRef = useRef(null);
  const [alInicio, setAlInicio] = useState(true);
  const [alFinal, setAlFinal] = useState(false);

  const destacados = estado.productos.slice(0, cantidad);
  if (destacados.length === 0) return null;

  function actualizarBordes(swiper) {
    setAlInicio(swiper.isBeginning);
    setAlFinal(swiper.isEnd);
  }

  return (
    <div className="carrusel">
      <div className="carrusel__nav">
        <button
          type="button"
          className={`carrusel__flecha ${alInicio ? 'disabled' : ''}`}
          aria-label="Producto anterior"
          disabled={alInicio}
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <svg width="16" height="28" viewBox="0 0 16 28" fill="none" aria-hidden="true">
            <path d="M14 26L2 14L14 2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className={`carrusel__flecha ${alFinal ? 'disabled' : ''}`}
          aria-label="Producto siguiente"
          disabled={alFinal}
          onClick={() => swiperRef.current?.slideNext()}
        >
          <svg width="16" height="28" viewBox="0 0 16 28" fill="none" aria-hidden="true">
            <path d="M2 26L14 14L2 2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        slidesPerView="auto"
        spaceBetween={20}
        speed={600}
        centeredSlides
        initialSlide={Math.min(1, destacados.length - 1)}
        watchSlidesProgress
        pagination={{ clickable: true }}
        breakpoints={{ 768: { spaceBetween: 40 } }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          actualizarBordes(swiper);
        }}
        onSlideChange={actualizarBordes}
      >
        {destacados.map((p) => {
          const stock = estadoStock(p.stock);
          return (
            <SwiperSlide key={p.id} className="carrusel__slide">
              <article className="carrusel-item">
                {stock.variante !== 'success' && (
                  <div className="carrusel-item__badge">{stock.texto}</div>
                )}

                <div className="carrusel-item__image">
                  <img src={p.imagen} alt={p.nombre} loading="lazy" />
                </div>

                <div className="carrusel-item__content">
                  <div className="carrusel-item__header">
                    <div className="carrusel-item__header-inner">
                      <div className="carrusel-item__price">{precioCLP(p.precio)}</div>
                      <div className="carrusel-item__marca">{p.marca}</div>
                    </div>
                  </div>

                  <div className="carrusel-item__info">
                    <h2 className="carrusel-item__title">{p.nombre}</h2>
                    <p className="carrusel-item__text">{p.descripcion}</p>
                  </div>

                  <div className="carrusel-item__footer">
                    <Link className="carrusel-item__btn" to="/productos">
                      Ver en el catálogo <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}