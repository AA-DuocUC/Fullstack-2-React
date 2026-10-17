import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom no incluye matchMedia y Swiper (carrusel del inicio) lo necesita.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  });
}

beforeEach(() => localStorage.clear());

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});
