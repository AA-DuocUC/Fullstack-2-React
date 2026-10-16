import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { cargarTienda, guardarTienda } from '../services/almacen_tienda.js';
import { tiendaReducer } from '../store/TiendaVergataria.js';
 
const TiendaContext = createContext(null);
export function TiendaProvider({ children }) {
  const [estado, dispatch] = useReducer(tiendaReducer, undefined, cargarTienda);
  const [errorGuardado, setErrorGuardado] = useState(false);
  useEffect(() => {
     // eslint-disable-next-line react-hooks/set-state-in-effect
    setErrorGuardado(!guardarTienda(estado));
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.productos, estado.carrito]);
  return (
    <TiendaContext.Provider value={{ estado, dispatch, errorGuardado }}>
      {children}
    </TiendaContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useTienda() {
  const contexto = useContext(TiendaContext);
  if (!contexto)
    throw new Error('useTienda debe usarse dentro de TiendaProvider.');
  return contexto;
}