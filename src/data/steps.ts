// Cómo trabajo, en 3 pasos. Los textos viven en pasos.json, que se edita desde /admin.
import data from "./pasos.json";

export const stepsTitle: string = data.titulo;
export const journey: { title: string; text: string }[] = data.pasos;

// Los 4 pasos anteriores: solo los usan /escueta y /suelta, que se borran al publicar
export const steps = [
  { title: "Primero, contexto.", text: "Qué tienes ya, qué echas en falta, si tienes el contenido listo, si tienes dominio y servidor y si sabes lo que cuesta todo eso. Lo que más retrasa una web es el contenido, así que eso se ve al principio y no al final." },
  { title: "Diseño antes de programar.", text: "Ves cómo va a quedar antes de que construya nada, y te enseño avances sobre la marcha. Lo que apruebas en el diseño es lo que se publica, porque no pasa por otras manos." },
  { title: "Cambios.", text: "Los retoques sobre el diseño van incluidos. Si la idea cambia a mitad de camino, se habla y se presupuesta aparte." },
  { title: "Entrega.", text: "La web publicada y una reunión en la que te enseño a usarla, para que no dependas de mí." },
];
