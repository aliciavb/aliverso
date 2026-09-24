// Proyectos de la home. Los textos viven en proyectos.json, que se edita desde /admin.
// color: el papel de la carpeta. screen: la captura de la ficha, recortada a 16:10.
import data from "./proyectos.json";

export type Case = {
  name: string; meta: string; short: string; color: string; screen?: string;
  summary?: string; url?: string; urlLabel?: string;
  problem?: string; decision?: string; result?: string;
};

export const cases: Case[] = data.proyectos;
