// One particle constellation that re-forms per slide. Canvas 2D with hand projection, no dependencies.
(function () {
  const cv = document.getElementById('sky');
  if (!cv) return;
  const ctx = cv.getContext('2d'), N = 2600, TAU = Math.PI * 2;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COLORS = ['#ffffff', '#8052ff', '#ffb829', '#15846e', '#b9a3ff'];
  const R = (a, b) => a + Math.random() * (b - a);

  // --- point generators: each returns [x, y, z] in roughly -1..1, y up ---
  const ball = (cx, cy, cz, r) => () => {
    const u = R(-1, 1), t = R(0, TAU), s = Math.sqrt(1 - u * u);
    return [cx + r * s * Math.cos(t), cy + r * u, cz + r * s * Math.sin(t)];
  };
  const seg = (a, b, w) => () => {
    const t = Math.random();
    return [0, 1, 2].map(k => a[k] + (b[k] - a[k]) * t + R(-w, w));
  };
  const ring = (cx, cy, r, w) => () => {
    const t = R(0, TAU);
    return [cx + r * Math.cos(t) + R(-w, w), cy + r * Math.sin(t) + R(-w, w), R(-w, w)];
  };
  const mix = (...parts) => {
    const total = parts.reduce((s, p) => s + p[0], 0);
    return () => {
      let k = Math.random() * total;
      for (const [w, f] of parts) if ((k -= w) < 0) return f();
      return parts[0][1]();
    };
  };
  // Draw a silhouette on a small canvas, then scatter points over its filled pixels.
  const sample = (draw, depth = 0.14) => {
    const S = 160, c = document.createElement('canvas');
    c.width = c.height = S;
    const g = c.getContext('2d');
    g.fillStyle = g.strokeStyle = '#fff'; g.lineCap = g.lineJoin = 'round';
    draw(g, S);
    const d = g.getImageData(0, 0, S, S).data, pts = [];
    for (let i = 3; i < d.length; i += 4) if (d[i] > 100) pts.push((i - 3) / 4);
    if (!pts.length) return ball(0, 0, 0, 0.9);
    return () => {
      const p = pts[(Math.random() * pts.length) | 0];
      return [((p % S) + Math.random()) / S * 2 - 1, 1 - (((p / S) | 0) + Math.random()) / S * 2, R(-depth, depth)];
    };
  };
  const glyph = ch => sample((g, S) => {
    g.font = `700 ${ch.length > 1 ? 96 : 140}px Inter, system-ui, sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(ch, S / 2, S / 2 + 6);
  });

  const nodes = [[.85, 0, 0], [-.6, .55, .2], [-.3, -.75, .3], [.35, .7, -.35], [.3, -.55, -.6], [-.7, -.1, -.5]];
  const rays = Array.from({ length: 36 }, () => ball(0, 0, 0, 1)());

  // Built lazily on first use so glyph shapes see loaded fonts.
  const SHAPES = {
    brain: () => () => {
      const s = Math.random() < 0.5 ? -1 : 1, [x, y, z] = ball(0, 0, 0, 1)();
      const w = 1 + 0.08 * Math.sin(x * 8 + y * 5) * Math.cos(z * 7);
      return [s * 0.36 + x * 0.38 * w, y * 0.54 * w, z * 0.5 * w];
    },
    orb: () => ball(0, 0, 0, 0.95),
    lens: () => mix(
      [5, ring(-.18, .18, .62, .035)],
      [1.2, () => { const r = Math.sqrt(Math.random()) * .58, t = R(0, TAU); return [-.18 + r * Math.cos(t), .18 + r * Math.sin(t), R(-.02, .02)]; }],
      [2.2, seg([.3, -.3, 0], [.85, -.85, 0], .05)]),
    play: () => mix(
      [4, ring(0, 0, .95, .03)],
      [3, () => { let a = Math.random(), b = Math.random(); if (a + b > 1) { a = 1 - a; b = 1 - b; } return [-.32 + b * .87, .5 - a - b * .5, R(-.05, .05)]; }]),
    network: () => mix(
      [3, ball(0, 0, 0, .3)],
      ...nodes.map(n => [1, ball(n[0], n[1], n[2], .13)]),
      ...nodes.map(n => [.5, seg([0, 0, 0], n, .008)])),
    layers: () => () => [R(-.8, .8), -.6 + ((Math.random() * 4) | 0) * .4, R(-.55, .55)],
    trio: () => mix([1, ball(-.72, 0, 0, .3)], [1, ball(0, 0, 0, .3)], [1, ball(.72, 0, 0, .3)]),
    burst: () => () => {
      if (Math.random() < 0.25) return ball(0, 0, 0, .22)();
      const d = rays[(Math.random() * rays.length) | 0], r = R(.3, 1);
      return d.map(v => v * r + R(-.015, .015));
    },
    bars: () => mix(...[[.5, -.62], [.95, 0], [1.45, .62]].map(([h, x]) =>
      [h, () => [x + R(-.2, .2), -.72 + Math.random() * h, R(-.2, .2)]])),
    rupee: () => glyph('₹'),
    prompt: () => glyph('>_'),
    raven: () => sample(g => {
      g.beginPath(); g.ellipse(80, 92, 40, 24, -0.3, 0, TAU); g.fill();            // body
      g.beginPath(); g.arc(114, 62, 16, 0, TAU); g.fill();                          // head
      g.beginPath(); g.moveTo(126, 55); g.lineTo(154, 63); g.lineTo(126, 71); g.fill(); // beak
      g.beginPath(); g.moveTo(52, 98); g.lineTo(8, 124); g.lineTo(18, 98); g.lineTo(48, 84); g.fill(); // tail
      g.beginPath(); g.moveTo(72, 82); g.lineTo(26, 36); g.lineTo(62, 42); g.lineTo(104, 78); g.fill(); // wing
    }),
    shield: () => sample(g => {
      g.lineWidth = 8; g.beginPath();
      g.moveTo(80, 14); g.lineTo(136, 34); g.lineTo(136, 82);
      g.bezierCurveTo(136, 112, 112, 136, 80, 148);
      g.bezierCurveTo(48, 136, 24, 112, 24, 82);
      g.lineTo(24, 34); g.closePath(); g.stroke();
      g.beginPath(); g.arc(80, 72, 11, 0, TAU); g.fill();                           // keyhole
      g.lineWidth = 9; g.beginPath(); g.moveTo(80, 78); g.lineTo(80, 104); g.stroke();
    }),
    check: () => sample(g => {
      g.lineWidth = 5; g.beginPath(); g.arc(80, 80, 70, 0, TAU); g.stroke();
      g.lineWidth = 15; g.beginPath(); g.moveTo(46, 84); g.lineTo(70, 108); g.lineTo(116, 52); g.stroke();
    }),
  };
  const PITCH = { layers: 0.45, bars: 0.2 };
  const built = {};

  const x = new Float32Array(N), y = new Float32Array(N), z = new Float32Array(N);
  const tx = new Float32Array(N), ty = new Float32Array(N), tz = new Float32Array(N);
  const dl = new Float32Array(N), sz = new Float32Array(N), ph = new Float32Array(N), col = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    [x[i], y[i], z[i]] = ball(0, 0, 0, 1.3)();
    const r = Math.random();
    col[i] = r < .34 ? 0 : r < .64 ? 1 : r < .8 ? 2 : r < .9 ? 3 : 4;
    sz[i] = R(.6, 1.7); ph[i] = R(0, TAU);
  }

  let pitch = 0.12, w = 0, h = 0, mx = 0, my = 0, px = 0, py = 0, mode = 'big', pcx = null, pcy = 0, pS = 0;
  function morph(name) {
    const gen = built[name] || (built[name] = (SHAPES[name] || SHAPES.orb)());
    const now = performance.now();
    pitch = 0.12 + (PITCH[name] || 0);
    for (let i = 0; i < N; i++) {
      [tx[i], ty[i], tz[i]] = gen();
      dl[i] = now + R(0, 500);
      if (still) { x[i] = tx[i]; y[i] = ty[i]; z[i] = tz[i]; }
    }
  }

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener('resize', resize); resize();
  addEventListener('pointermove', e => { mx = e.clientX / w - 0.5; my = e.clientY / h - 0.5; });

  function frame(t) {
    const wide = w > 900, big = mode === 'big', gut = Math.min(Math.max(w * 0.06, 24), 96);
    // big: beside a title. small: tucked into the top-right corner of a scene. It glides between the two.
    const tS = big ? Math.min(w * (wide ? 0.21 : 0.3), h * 0.34) : Math.min(Math.max(h * 0.1, 64), 104);
    const tcx = big ? w * (wide ? 0.73 : 0.5) : w - gut - tS * 1.1;
    const tcy = big ? h * (wide ? 0.5 : 0.28) : Math.min(Math.max(h * 0.06, 28), 60) + tS * 0.75;
    if (pcx === null || still) { pcx = tcx; pcy = tcy; pS = tS; }
    pcx += (tcx - pcx) * 0.09; pcy += (tcy - pcy) * 0.09; pS += (tS - pS) * 0.09;
    const cx = pcx, cy = pcy, S = pS, u = Math.max(S * 0.0085, 0.9), dim = big ? (wide ? 1 : 0.45) : 0.8;
    px += (mx - px) * 0.04; py += (my - py) * 0.04;
    const yaw = still ? 0.35 : Math.sin(t * 0.00022) * 0.6 + px * 0.5, pit = pitch + (still ? 0 : py * 0.3);
    const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit);
    const wob = still ? 0 : 0.012, spin = still ? 0 : t * 0.0004;
    const paths = Array.from({ length: 10 }, () => new Path2D());
    for (let i = 0; i < N; i++) {
      if (t >= dl[i]) { x[i] += (tx[i] - x[i]) * 0.075; y[i] += (ty[i] - y[i]) * 0.075; z[i] += (tz[i] - z[i]) * 0.075; }
      const wx = x[i] + Math.sin(t * 0.0009 + ph[i]) * wob, wy = y[i] + Math.cos(t * 0.0011 + ph[i] * 1.7) * wob;
      const X = wx * cyw + z[i] * syw, Z = -wx * syw + z[i] * cyw;
      const Y = wy * cp - Z * sp, Z2 = wy * sp + Z * cp, f = 3 / (3 + Z2);
      const sx = cx + X * f * S, sy = cy - Y * f * S, r = sz[i] * Math.min(f, 1.5) ** 2 * u, a = ph[i] + spin; // clamp: no giant near-camera triangles
      const p = paths[col[i] * 2 + (Z2 > 0 ? 1 : 0)];
      p.moveTo(sx + r * Math.cos(a), sy + r * Math.sin(a));
      p.lineTo(sx + r * Math.cos(a + 2.094), sy + r * Math.sin(a + 2.094));
      p.lineTo(sx + r * Math.cos(a + 4.189), sy + r * Math.sin(a + 4.189));
      p.closePath();
    }
    ctx.clearRect(0, 0, w, h);
    for (let b = 0; b < 10; b++) {
      ctx.globalAlpha = (b & 1 ? 0.38 : 0.92) * dim; // far particles fade
      ctx.fillStyle = COLORS[b >> 1];
      ctx.fill(paths[b]);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  window.Sky = { morph, place: m => (mode = m) };
})();
