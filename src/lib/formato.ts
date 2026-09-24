// Formato mínimo para los textos que se editan desde /admin (campos markdown con los botones
// negrita, cursiva y enlace). Primero se escapa todo; luego solo se reconocen esas tres marcas,
// así un < suelto no rompe la página.

const escapar = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const hrefSeguro = (url: string) => /^(https?:\/\/|mailto:|\/|#)/i.test(url);

const enfasis = (s: string) =>
  s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^\w*])[*_](?!\s)(.+?)(?<!\s)[*_](?![\w*])/g, "$1<em>$2</em>");

export function formato(texto?: string | null): string {
  if (!texto) return "";
  // Escapes de markdown (\. \* \_…) y enlaces se apartan con marcadores para que la negrita y la
  // cursiva no los toquen (una URL con _ no debe acabar en cursiva).
  const apartados: string[] = [];
  const apartar = (html: string) => `\u0000${apartados.push(html) - 1}\u0000`;

  let s = texto.trim().replace(/\\([\\`*_{}\[\]()#+\-.!~|<>])/g, (_, c) => apartar(escapar(c)));
  s = escapar(s);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, url) => {
    const href = url.replace(/&amp;/g, "&");
    if (!hrefSeguro(href)) return txt;
    const externo = /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?aliverso\.me/i.test(href);
    const attrs = externo ? ' target="_blank" rel="noopener noreferrer"' : "";
    return apartar(`<a href="${escapar(href)}"${attrs}>${enfasis(txt)}</a>`);
  });
  s = enfasis(s).replace(/\n+/g, "<br />");

  // Dos pasadas: el texto de un enlace puede llevar un escape apartado dentro.
  for (let i = 0; i < 2; i++) s = s.replace(/\u0000(\d+)\u0000/g, (_, n) => apartados[+n]);
  return s;
}
