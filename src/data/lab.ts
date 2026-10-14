// src/data/lab.ts — contenido de /lab (2026-10-14). Los textos viven en lab.json, editable desde /admin.
// El número de cada pieza sale de su orden en la lista; las apagadas en /admin no cuentan.
import datos from "./lab.json";

export const intro = datos.intro;
export const email = datos.email;

export interface Pieza {
  num: string;
  nombre: string;
  fecha: string;
  linea: string;
  demo?: string;
}

export const piezas: Pieza[] = datos.piezas
  .filter((p) => p.publicado !== false)
  .map((p, i) => ({ ...p, num: String(i + 1).padStart(2, "0") }));

export const mailCodigo = (p: Pieza) => `mailto:${email}?subject=${encodeURIComponent(`Código de ${p.nombre}`)}`;
