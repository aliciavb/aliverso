// Velado del hero: shader WebGL quieto (prototipo v7, prototipos/velado/index.html)
export function initVelado(canvas: HTMLCanvasElement) {
  const root = document.documentElement;
  const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false });
  const moving = false; // quieto por defecto (decidido 2026-09-16)

  if (!gl) return;

  const vs = `attribute vec2 a; void main(){ gl_Position = vec4(a,0.,1.); }`;
  const fs = `
precision mediump float;
uniform vec2 r; uniform float t; uniform float gt;
uniform vec3 g0; uniform vec3 g1;
uniform vec3 c1; uniform vec3 c2; uniform vec3 c3; uniform vec3 c4;
uniform float strength; uniform float grain; uniform float vig; uniform float dust;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){ float v=0., a=.55; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.03; a*=.5; } return v; }

// mancha de luz: elipse estirada en horizontal, deformada por ruido
float leak(vec2 p, vec2 c, vec2 s, float seed){
  vec2 d = (p - c) / s;
  float warp = fbm(vec2(p.x*1.1 + t*.35 + seed, p.y*4.0 - t*.12)) - .5;
  float e = length(d + vec2(warp*.9, warp*.35));
  return smoothstep(1.0, 0.0, e);
}

void main(){
  vec2 uv = gl_FragCoord.xy / r;
  float asp = r.x / r.y;
  vec2 p = vec2(uv.x * asp, uv.y);

  // suelo: degradado vertical
  vec3 col = mix(g1, g0, smoothstep(0., 1., uv.y*.8 + .2));

  // bandas horizontales de velado
  float streak = fbm(vec2(p.x*.6 - t*.5, p.y*5.5));

  float m1 = leak(p, vec2(asp*.80 + .08*sin(t*.7), .78), vec2(.85, .42), 1.3);
  float m2 = leak(p, vec2(asp*.55 + .10*cos(t*.5), .30), vec2(1.10, .30), 4.1) * (.55 + .8*streak);
  // amarilla: más pequeña y desplazada a la derecha para dejar verde oscuro detrás del texto
  float m3 = leak(p, vec2(asp*.66 + .06*sin(t*.4), .02), vec2(.50, .22), 7.7);
  float m4 = leak(p, vec2(asp*.0, .70 + .04*cos(t*.6)), vec2(.60, .30), 2.9);

  // protege la columna de texto: abajo a la izquierda
  float calm = smoothstep(.05, .8, distance(uv, vec2(.30, .18)) * 1.5);

  col = mix(col, c4, clamp(m4 * .7 * strength, 0., 1.));
  col = mix(col, c3, clamp(m3 * .85 * strength, 0., 1.));
  col = mix(col, c2, clamp(m2 * (.55 + .45*calm) * strength, 0., 1.));
  col = mix(col, c1, clamp(m1 * (.65 + .35*calm) * strength, 0., 1.));
  // núcleo quemado: casi crema donde el velado es más intenso
  col = mix(col, vec3(.97,.92,.82), clamp(pow(m1*m2*2.2 + m3*m3*.35, 2.) * strength * .6, 0., 1.));

  // viñeta
  float v = smoothstep(1.15, .25, length((uv - .5) * vec2(1.25, 1.1)));
  col *= mix(1. - vig, 1., v);

  // grano (apagado: pendiente probar el del escaneo)
  float n = hash(floor(gl_FragCoord.xy) + gt * 17.13) - .5;
  col += n * grain;

  // polvo y motas (apagado)
  vec2 cell = floor(gl_FragCoord.xy / 2.);
  float speck = step(.9978, hash(cell + floor(gt / 5.) * 3.71));
  col = mix(col, mix(vec3(.95,.92,.85), c4, hash(cell)), speck * dust * .8);

  gl_FragColor = vec4(col, 1.);
}`;

  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const aLoc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(aLoc);
  gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = {
    r: U("r"), t: U("t"), gt: U("gt"), g0: U("g0"), g1: U("g1"),
    c1: U("c1"), c2: U("c2"), c3: U("c3"), c4: U("c4"),
    strength: U("strength"), grain: U("grain"), vig: U("vig"), dust: U("dust"),
  };

  const hex = (h: string) => {
    h = h.trim().replace("#", "");
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  };
  function readTokens() {
    const cs = getComputedStyle(root);
    const v = (n: string) => cs.getPropertyValue(n);
    gl!.uniform3fv(u.g0, hex(v("--ground")));
    gl!.uniform3fv(u.g1, hex(v("--ground-deep")));
    gl!.uniform3fv(u.c1, hex(v("--leak-1")));
    gl!.uniform3fv(u.c2, hex(v("--leak-2")));
    gl!.uniform3fv(u.c3, hex(v("--leak-3")));
    gl!.uniform3fv(u.c4, hex(v("--leak-4")));
    gl!.uniform1f(u.strength, parseFloat(v("--leak-strength")));
    gl!.uniform1f(u.grain, parseFloat(v("--grain")));
    gl!.uniform1f(u.vig, parseFloat(v("--vignette")));
    gl!.uniform1f(u.dust, parseFloat(v("--dust")) || 0);
  }

  const SCALE = 0.6; // resolución interna: suaviza el velado y abarata el render
  function resize() {
    const w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
    const h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl!.viewport(0, 0, w, h);
    }
    gl!.uniform2f(u.r, w, h);
  }

  let last = 8.0;
  function draw(ms: number) {
    resize();
    const s = ms / 1000;
    gl!.uniform1f(u.t, s * 0.12);
    gl!.uniform1f(u.gt, Math.floor(s * 24) % 997); // grano a 24 fps, como película
    gl!.drawArrays(gl!.TRIANGLES, 0, 6);
  }
  const start = performance.now() - 8000;
  function loop(now: number) {
    if (!moving) return;
    last = now - start;
    if (!document.hidden) draw(last);
    requestAnimationFrame(loop);
  }

  readTokens();
  draw(last);
  if (moving) requestAnimationFrame(loop);

  addEventListener("resize", () => {
    if (!moving) draw(last);
  });
}

// Foto de perfil: ratón encima saca los dientes, ratón fuera vuelve atrás
export function initCamara(cam: HTMLElement) {
  const screen = cam.querySelector<HTMLElement>(".screen")!;
  const lastFrame = +cam.dataset.frames! - 1;
  const msIn = +cam.dataset.msIn!, msOut = +cam.dataset.msOut!; // ms por fotograma
  let frame = 0, target = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let onDone: (() => void) | null = null;

  const draw = () => (screen.style.backgroundPosition = (frame / lastFrame) * 100 + "% 0");

  // avanza fotograma a fotograma hacia "target"; si cambia a mitad, gira desde donde esté
  function goTo(t: number, done?: () => void) {
    target = t;
    onDone = done || null;
    if (timer) return;
    const tick = () => {
      if (frame === target) {
        timer = null;
        const cb = onDone;
        onDone = null;
        cb && cb();
        return;
      }
      const fwd = frame < target;
      frame += fwd ? 1 : -1;
      draw();
      timer = setTimeout(tick, fwd ? msIn : msOut);
    };
    tick();
  }

  cam.addEventListener("mouseenter", () => goTo(lastFrame));
  cam.addEventListener("mouseleave", () => goTo(0));
  cam.addEventListener("touchstart", () => goTo(target === lastFrame ? 0 : lastFrame), { passive: true });

  // primera vez en pantalla, con retraso; si sale de pantalla antes, se cancela y espera a la próxima
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let wait: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) {
          if (wait) clearTimeout(wait);
          wait = null;
          return;
        }
        if (wait) return;
        wait = setTimeout(() => {
          io.disconnect();
          if (cam.matches(":hover")) return;
          goTo(lastFrame, () => setTimeout(() => { if (!cam.matches(":hover")) goTo(0); }, 700));
        }, +cam.dataset.introDelay!);
      },
      { threshold: 0.6 }
    );
    io.observe(cam);
  }
}
