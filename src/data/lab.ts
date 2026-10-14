// src/data/lab.ts — contenido de /lab (2026-10-14).

export const intro = "Piezas pequeñas de diseño y código que salen de algo rutinario que me inspira a crear.";
export const email = "hola@aliverso.me";

export interface Pieza {
  num: string;
  nombre: string;
  fecha: string;
  linea: string;
  demo?: string;
  hueco?: boolean;
}

export const piezas: Pieza[] = [
  {
    num: "01",
    nombre: "Nuestra historia",
    fecha: "Octubre 2026",
    linea: "La sección «Nuestra historia» de una web de boda, como un libro que se hojea cogiendo la esquina.",
    demo: "/lab/nuestra-historia/?fondo=transparente",
  },
];

export const mailCodigo = (p: Pieza) => `mailto:${email}?subject=${encodeURIComponent(`Código de ${p.nombre}`)}`;
