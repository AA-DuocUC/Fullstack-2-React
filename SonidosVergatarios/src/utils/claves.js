// DEMOSTRACIÓN ACADÉMICA: ofusca la contraseña para no guardarla en texto plano
// dentro de localStorage. No es seguridad real: en una tienda de verdad el
// registro y la verificación de claves los hace un servidor (con bcrypt/argon2).

function cyrb53(texto, semilla = 0) {
  let h1 = 0xdeadbeef ^ semilla;
  let h2 = 0x41c6ce57 ^ semilla;
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export function crearSal() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`
  );
}

export function hashClave(clave, sal) {
  const base = `${sal}:${clave}`;
  return [1, 2]
    .map((semilla) => cyrb53(base, semilla).toString(16).padStart(14, '0'))
    .join('');
}
