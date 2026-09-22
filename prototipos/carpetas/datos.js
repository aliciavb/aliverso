// Datos de los casos: los mismos del mosaico. Solo datos con fuente; lo que falta sale como pendiente.
const IMG = '../../public/assets/projects/';
const CASES = [
  {
    id: 'i23', no: '01', short: 'i23', name: 'Galería i23', meta: 'Web de apertura · WordPress', url: 'i23.art', color: '--p-crema',
    frames: ['i23/portada.webp'],
    result: 'La galería lleva tres temporadas de exposiciones publicadas por su cuenta, sin mí.',
    problem: 'La galería aún no existía. Tenían el local en la calle Ibiza 23, la identidad de marca hecha y un Instagram que anunciaba la apertura. Necesitaban la web para abrir.',
    decision: 'Pasé su identidad a la web y la programé en WordPress. Podía montar cada exposición como una página suelta, pero preparé una estructura para que publicar una nueva fuera rellenar una ficha, tanto para mí como para quien la editara después.',
    type: 'Graphik + Tiempos Headline', palette: ['#607a9c', '#e0ddd4', '#111111']
  },
  {
    id: 'tai', no: '02', short: 'TAI', name: 'Escuela TAI', meta: 'Mantenimiento y diseño · 2022–2024', url: 'taiarts.com', color: '--p-salvia',
    frames: ['tai/portada.webp', 'tai/degrees-in-english.webp'],
    result: 'Sigue online y la editan ellos. En diciembre de 2025, un año después de irme, me volvieron a llamar para cubrir una baja.',
    problem: 'Es la web de una escuela universitaria de artes: fichas de cada carrera, páginas de cada departamento, formularios de captación, campañas. La visitan a diario futuros alumnos y alumnos actuales, así que tiene que estar siempre al día y bien cuidada.',
    decision: 'De 2022 a 2024 fui quien la mantenía. Recogía en reunión lo que pedía cada departamento y lo llevaba a la web: formularios, portada, fechas, módulos nuevos y rediseños de los que ya había. Diseñé una landing que después sirvió de referencia para las siguientes.',
    type: 'Lausanne (por confirmar)', palette: ['#0d151d', '#877f77', '#c6c4c3']
  },
  {
    id: 'factoria', no: '03', short: 'Factoría', name: 'Factoría de Creación', meta: 'Diseño y web', url: 'factoriadecreacion.com', color: '--p-kraft',
    frames: ['factoria/portada-mockup.webp', 'factoria/pagina-1.webp', 'factoria/pagina-2.webp', 'factoria/pagina-3.webp'],
    type: 'Linden Hill + Montserrat', palette: ['#16110f', '#8c8077', '#ffffff']
  },
  {
    id: 'wenow', no: '04', short: 'WE:NOW', name: 'Festival WE:NOW', meta: 'Web y ecommerce · WordPress', url: 'wenow.art', color: '--p-oliva',
    frames: ['wenow/portada-2024.webp', 'wenow/expos.webp'],
    type: null, palette: ['#f6dc00', '#0766bf', '#070f1b']
  },
  {
    id: 'aiwrapped', no: '05', short: 'AI Wrapped', name: 'AI Wrapped', meta: 'Diseño y desarrollo', url: 'ai-wrapped.entaina.ai', color: '--p-salmon',
    frames: ['aiwrapped/detalle-3.webp', 'aiwrapped/detalle-5.webp', 'aiwrapped/detalle-4.webp'],
    type: null, palette: ['#122143', '#163b4b', '#61798d']
  }
];

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

// La ficha: pantalla con la captura + textos + muestras de color. Igual en las tres versiones.
function ficha(c, { title = true } = {}) {
  const thumbs = c.frames.length > 1
    ? `<div class="thumbs">${c.frames.map((f, i) => `<button type="button" data-shot="${IMG + f}" aria-pressed="${i === 0}" aria-label="Ver imagen ${i + 1}"><img src="${IMG + f}" alt="" loading="lazy"></button>`).join('')}</div>`
    : '';
  const how = c.problem
    ? `<details><summary>Cómo fue</summary><dl>
         <div><dt>Problema</dt><dd>${esc(c.problem)}</dd></div>
         <div><dt>Decisión</dt><dd>${esc(c.decision)}</dd></div></dl></details>`
    : '';
  return `<div class="ficha">
    <div class="browser">
      <div class="bar"><i></i><i></i><i></i><span>${esc(c.url)}</span></div>
      <div class="shot"><img src="${IMG + c.frames[0]}" alt="Web de ${esc(c.name)}" loading="lazy"></div>
      ${thumbs}
    </div>
    <div>
      <p class="mono" style="margin:0;opacity:.7">${esc(c.meta)}</p>
      ${title ? `<h3>${esc(c.name)}</h3>` : ''}
      ${c.result ? `<p class="res">${esc(c.result)}</p>` : '<span class="pending">Texto pendiente · problema, decisión y resultado</span>'}
      ${how}
      <div class="chips">${c.palette.map(h => `<button type="button" style="background:${h}" data-hex="${h}" aria-label="Copiar ${h}"></button>`).join('')}</div>
      <div class="toast" aria-live="polite"></div>
      <div class="row"><span>Tipo · ${c.type ? esc(c.type) : 'por confirmar'}</span></div>
    </div>
  </div>`;
}

// Tocar una miniatura cambia la captura; tocar una muestra copia el color
document.addEventListener('click', async e => {
  const t = e.target.closest('[data-shot]');
  if (t) {
    const img = t.closest('.browser').querySelector('.shot img');
    img.style.opacity = 0;
    setTimeout(() => { img.src = t.dataset.shot; img.style.opacity = 1; }, REDUCE ? 0 : 180);
    t.parentElement.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b === t));
    return;
  }
  const chip = e.target.closest('.chips button');
  if (chip) {
    const hex = chip.dataset.hex, toast = chip.closest('.ficha').querySelector('.toast');
    let ok = false; try { await navigator.clipboard.writeText(hex); ok = true; } catch {}
    chip.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('copied', b === chip));
    toast.textContent = ok ? `${hex} copiado` : hex;
    clearTimeout(chip._t); chip._t = setTimeout(() => { toast.textContent = ''; chip.classList.remove('copied'); }, 1600);
  }
});
