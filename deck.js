// Presentation. Each session: a title screen, then scenes (cards, diagrams, media). The countdown runs per session.
(function () {
  const W = window.WORKSHOP, $ = s => document.querySelector(s);
  const stage = $('#stage'), meta = $('#meta'), bar = $('#bar');
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  // h() is only ever given strings written in this file or icons.js, never content text
  const h = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
  const pad = n => String(n).padStart(2, '0');
  const delay = (e, k) => (e.style.setProperty('--i', k), e);

  // Phosphor duotone icons (icons.js) and brand logos (assets/logos). A missing logo removes itself.
  const icon = n => h(`<svg class="ic" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">${(window.ICONS || {})[n] || ''}</svg>`);
  const logos = it => {
    const list = it.logos || (it.logo ? [it.logo] : []);
    if (!list.length) return null;
    const row = el('div', 'logos');
    list.forEach(n => {
      const im = el('img', 'logo' + (n.endsWith('.png') ? ' raster' : ''));
      im.src = `assets/logos/${n.includes('.') ? n : n + '.svg'}`; im.alt = ''; im.onerror = () => im.remove();
      row.append(im);
    });
    return row;
  };
  const mark = (it, host) => { const l = logos(it); if (l) host.append(l); else if (it.icon) host.append(icon(it.icon)); };

  const S = [{ kind: 'index', shape: 'brain' }];
  W.sessions.forEach(s => { S.push({ kind: 'title', s }); s.scenes.forEach(sc => S.push({ kind: 'scene', s, sc })); });
  S.push({ kind: 'close', shape: 'brain' });

  // Votes and scores survive a reload during the session.
  const saved = (() => { try { return JSON.parse(sessionStorage.getItem('ws') || '{}'); } catch { return {}; } })();
  const votes = saved.votes || W.topics.map(() => 0);
  const scores = saved.scores || W.candidates.map(t => ({ t, v: W.dims.map(() => '') }));
  const save = () => { try { sessionStorage.setItem('ws', JSON.stringify({ votes, scores })); } catch {} };
  const chosen = () => votes.indexOf(Math.max(...votes));
  const promptText = key => W.prompt(key, W.topics[chosen()].t, 'claude');

  // A copy button with the prompt folded away underneath; open it only when you want to read it.
  function copyBox(key, label, k) {
    const box = el('div', 'copybox'), row = el('div', 'row'), b = el('button', 'pill', label);
    if (k) b.dataset.k = k;
    b.onclick = () => copyText(promptText(key), b);
    const show = el('button', 'ghost', 'Show prompt'), pre = el('pre', 'peek');
    pre.hidden = true;
    show.setAttribute('aria-expanded', 'false');
    show.onclick = () => {
      pre.hidden = !pre.hidden;
      pre.textContent = promptText(key);
      show.textContent = pre.hidden ? 'Show prompt' : 'Hide prompt';
      show.setAttribute('aria-expanded', String(!pre.hidden));
    };
    row.append(b, show);
    box.append(row, pre);
    return box;
  }

  function card(it, k) {
    const c = delay(el('div', 'card' + (it.tone ? ' ' + it.tone : '')), k);
    mark(it, c);
    if (it.k) c.append(el('p', 'label', it.k));
    c.append(el('h3', '', it.t));
    if (it.d) c.append(el('p', '', it.d));
    if (it.list) { const ul = el('ul'); it.list.forEach(x => ul.append(el('li', '', x))); c.append(ul); }
    if (it.copy) c.append(copyBox(it.copy, 'Copy prompt'));
    if (it.href) { const a = el('a', '', 'Open the kit'); a.href = it.href; c.append(a); }
    return c;
  }

  function cell(c) {
    const td = el('td');
    if (Array.isArray(c)) td.append(el('i', 'dot ' + c[1]), c[0]);
    else if (c && typeof c === 'object') { const w = el('span', 'withlogo'); const l = logos(c); if (l) w.append(l); w.append(c.t); td.append(w); }
    else td.textContent = c;
    return td;
  }

  const R = {
    cards(sc, root) {
      let k = 0;
      if (sc.intro) root.append(el('p', 'intro', sc.intro));
      (sc.groups || [{ items: sc.items }]).forEach(g => {
        if (g.label) root.append(el('p', 'label', g.label));
        const n = sc.cols || g.items.length, grid = el('div', 'grid' + (n >= 5 ? ' dense' : ''));
        grid.style.setProperty('--cols', n);
        g.items.forEach(it => grid.append(card(it, k++)));
        root.append(grid);
      });
    },
    flow(sc, root) {
      const f = el('div', 'flow' + (sc.nodes.length >= 5 ? ' dense' : ''));
      sc.nodes.forEach((n, k) => {
        if (k) f.append(delay(el('div', 'link'), k));
        const nd = delay(el('div', 'node' + (n.tone ? ' ' + n.tone : '')), k);
        mark(n, nd);
        if (n.k) nd.append(el('p', 'label', n.k));
        nd.append(el('h3', '', n.t));
        if (n.d) nd.append(el('p', '', n.d));
        f.append(nd);
      });
      root.append(f);
      if (sc.loop) root.append(el('div', 'loopback'));
      if (sc.note) root.append(el('p', 'intro', sc.note));
      if (sc.link) {
        const a = el('a', 'biglink'); a.href = sc.link.href; a.target = '_blank'; a.rel = 'noopener';
        const l = logos(sc.link); if (l) a.append(l);
        a.append(sc.link.t, el('span', '', ' ↗'));
        root.append(a);
      }
    },
    nest(sc, root) {
      let host = root;
      sc.layers.forEach((l, k) => {
        const b = delay(el('div', 'layer l' + k), k), hd = el('div', 'layer-head');
        hd.append(el('h3', '', l.t), el('p', '', l.d));
        b.append(hd); host.append(b); host = b;
      });
    },
    // Sequence diagram: actors across the top, one message per step, revealed with the arrow keys.
    seq(sc, root) {
      const n = sc.actors.length, g = el('div', 'seq');
      g.style.setProperty('--cols', n);
      sc.actors.forEach((a, k) => {
        const c = delay(el('div', 'actor'), k);
        mark(a, c); c.append(el('h3', '', a.t), el('p', '', a.d));
        c.style.gridColumn = k + 1;
        g.append(c);
      });
      for (let k = 0; k < n; k++) { const l = el('div', 'life'); l.style.gridColumn = k + 1; l.style.gridRow = `2 / span ${sc.msgs.length}`; g.append(l); }
      sc.msgs.forEach((m, k) => {
        const lo = Math.min(m.from, m.to), hi = Math.max(m.from, m.to), span = hi - lo + 1;
        const row = el('div', 'msg' + (k < step ? ' on' : '') + (k === step - 1 ? ' fresh' : '') + (m.tone ? ' ' + m.tone : '') + (m.from === m.to ? ' self' : m.to < m.from ? ' left' : ''));
        row.style.gridColumn = `${lo + 1} / span ${span}`; row.style.gridRow = k + 2;
        row.style.setProperty('--pad', (50 / span) + '%');
        const arrow = el('div', 'arrow'), lab = el('p', '', m.t);
        lab.prepend(el('span', 'num', (k + 1) + '  '));
        row.append(arrow, lab);
        g.append(row);
      });
      root.append(g);
    },
    api(sc, root) {
      root.append(el('p', 'full', sc.full), el('p', 'intro', sc.plain));
      const wrap = el('div', 'api');
      const panel = (title, rows, cls, k) => {
        const p = delay(el('div', 'card ' + cls), k);
        p.append(el('p', 'label', title));
        rows.forEach(([a, b]) => { const r = el('div', 'kv'); r.append(el('span', 'num', a), el('span', '', b)); p.append(r); });
        return p;
      };
      const pipe = delay(el('div', 'pipe'), 1);
      pipe.append(el('span', 'label', 'over the internet'), el('div', 'link'), el('div', 'link back'));
      wrap.append(panel('Your program sends', sc.req, '', 0), pipe, panel('The model sends back', sc.res, 'iris', 2));
      root.append(wrap);
      if (sc.note) root.append(el('p', 'intro', sc.note));
    },
    graph(sc, root) { R.cards({ items: sc.nodes }, root); },
    table(sc, root) {
      const d = W[sc.key], t = el('table'), hr = el('tr');
      if (sc.intro) root.append(el('p', 'intro', sc.intro));
      d.head.forEach(c => hr.append(el('th', '', c)));
      t.append(hr);
      d.rows.forEach((r, k) => { const tr = delay(el('tr'), k); r.forEach(c => tr.append(cell(c))); t.append(tr); });
      t.append(el('caption', '', d.checked));
      root.append(t);
    },
    chat(sc, root) {
      const row = el('div', 'grid');
      row.style.setProperty('--cols', sc.chats.length);
      sc.chats.forEach((c, k) => {
        const box = delay(el('div', 'card chat'), k), who = el('div', 'who');
        const l = logos({ logo: 'telegram' }); if (l) who.append(l);
        who.append(c.who);
        box.append(who, el('h3', '', c.lines[0]), el('p', '', c.lines[1]));
        if (c.buttons.length) { const b = el('div', 'btns'); c.buttons.forEach(x => b.append(el('span', '', x))); box.append(b); }
        row.append(box);
      });
      root.append(row);
      if (sc.note) root.append(el('p', 'intro', sc.note));
    },
    media(sc, root) {
      const m = el('div', 'media'), v = el('video'), facts = el('div', 'facts');
      v.src = sc.video + '#t=0.1'; v.controls = true; v.preload = 'metadata'; v.playsInline = true;
      sc.facts.forEach((f, k) => { const d = delay(el('div', 'fact'), k); d.append(el('h3', '', f.t), el('p', '', f.d)); facts.append(d); });
      m.append(v, facts); root.append(m);
    },
    poll(sc, root) {
      const draw = first => {
        root.textContent = '';
        const lead = chosen(), any = Math.max(...votes) > 0;
        const grid = el('div', 'grid' + (first ? '' : ' still'));
        grid.style.setProperty('--cols', W.topics.length);
        W.topics.forEach((t, k) => {
          const c = delay(el('div', 'card' + (any && k === lead ? ' amber' : '')), k);
          const row = el('div', 'row'), plus = el('button', 'ghost', 'Add a vote'), minus = el('button', 'ghost', 'Remove');
          plus.onclick = () => { votes[k]++; save(); draw(); };
          minus.onclick = () => { votes[k] = Math.max(0, votes[k] - 1); save(); draw(); };
          row.append(plus, minus);
          c.append(el('p', 'label', 'ABC'[k]), el('h3', '', t.t), el('p', '', t.d), el('p', 'count', votes[k]), row);
          grid.append(c);
        });
        root.append(grid);
        if (any) {
          const prompts = el('div', 'prompts');
          prompts.append(el('p', 'label', `Prompts for ${'ABC'[lead]}`),
            copyBox('plan', '1  Plan', 1), copyBox('grill', '2  Questions', 2), copyBox('build', '3  Build', 3));
          root.append(prompts);
        } else root.append(el('p', 'label', 'Prompts appear for the leading topic'));
      };
      draw(true);
    },
    reveal(sc, root) {
      root.append(el('p', 'q', sc.q));
      if (step === 0) return;
      if (sc.a) root.append(el('p', 'a', sc.a), el('p', 'intro', sc.d));
      if (sc.list) R.cards({ items: sc.list, cols: sc.list.length }, root);
    },
    compare(sc, root) {
      if (sc.intro) root.append(el('p', 'intro', sc.intro));
      const g = el('div', 'grid');
      g.style.setProperty('--cols', sc.sides.length);
      sc.sides.forEach((s, k) => {
        const c = delay(el('div', 'card side ' + s.tone), k), path = el('div', 'flow mini');
        s.path.forEach((p, j) => {
          if (j) path.append(delay(el('div', 'link'), j + k * 3));
          const nd = el('div', 'node'); mark(p, nd); nd.append(el('h3', '', p.t)); path.append(nd);
        });
        c.append(el('p', 'label', s.k), path, el('p', '', s.d));
        g.append(c);
      });
      root.append(g);
    },
    chart(sc, root) {
      const max = Math.max(...sc.series.flatMap(s => s.pts)), n = sc.series[0].pts.length - 1;
      const X = k => 40 + (k / n) * 420, Y = v => 250 - (v / max) * 220;
      const lines = sc.series.map((s, k) =>
        `<polyline class="line ${s.tone}" style="--i:${k}" pathLength="1" points="${s.pts.map((v, j) => `${X(j).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}"/>` +
        `<text class="${s.tone}" x="468" y="${(Y(s.pts[n]) + 4).toFixed(1)}">${s.t}</text>`).join('');
      root.append(h(`<svg class="chart" viewBox="0 0 640 290" role="img" aria-label="Total spent over twelve months for four ways to pay">
        <path class="axis" d="M40 20V250H460"/><text x="40" y="275">Month 0</text><text x="420" y="275">Month 12</text><text x="40" y="12">Total spent</text>${lines}</svg>`));
      if (sc.note) root.append(el('p', 'intro', sc.note));
    },
    score(sc, root) {
      const draw = () => {
        root.textContent = '';
        const t = el('table', 'score'), hr = el('tr');
        ['Idea', ...W.dims].forEach(c => hr.append(el('th', '', c)));
        t.append(hr);
        scores.forEach(r => {
          const tr = el('tr');
          tr.append(el('td', '', r.t));
          r.v.forEach((v, j) => {
            const td = el('td'), b = el('button', 'cell ' + v, v || '–');
            b.setAttribute('aria-label', `${r.t}, ${W.dims[j]}: ${v || 'not scored'}`);
            b.onclick = () => { r.v[j] = { '': 'H', H: 'M', M: 'L', L: '' }[v]; save(); draw(); };
            td.append(b); tr.append(td);
          });
          t.append(tr);
        });
        const inp = el('input');
        inp.placeholder = 'Add an idea, then press Enter'; inp.setAttribute('aria-label', 'Add an idea');
        inp.onkeydown = e => {
          e.stopPropagation();
          if (e.key === 'Enter' && inp.value.trim()) { scores.push({ t: inp.value.trim(), v: W.dims.map(() => '') }); save(); draw(); }
        };
        root.append(t, inp);
      };
      draw();
    },
  };

  // Hash is "slide.step", so a reload mid-session lands where you were.
  const [h0, h1] = location.hash.slice(1).split('.').map(n => parseInt(n, 10) || 0);
  let i = Math.min(Math.max(h0, 0), S.length - 1), step = 0, back = 1, last = performance.now();
  const spent = {};
  const maxStep = s => (s.kind !== 'scene' ? 0 : s.sc.type === 'reveal' ? 1 : s.sc.type === 'seq' ? s.sc.msgs.length : 0);

  function render(enter) {
    const s = S[i];
    stage.textContent = '';
    stage.className = s.kind + (enter ? ' enter' : '');
    if (s.kind === 'index') {
      stage.append(el('p', 'kicker', `4 hours · ${W.sessions.length} sessions`), el('h1', '', W.title), el('p', 'lead', W.objective));
      const ol = el('ol', 'index-list');
      W.sessions.forEach(ss => {
        const li = el('li'), b = el('button');
        b.append(el('span', 'num', pad(ss.n)), el('span', '', ss.title), el('span', 'num', `${ss.min} min`));
        b.onclick = () => go(S.findIndex(x => x.kind === 'title' && x.s === ss));
        li.append(b); ol.append(li);
      });
      const hint = el('p', 'hint', '→ next · ← back · I index · 1 2 3 copy prompts · T reset timer · ');
      const kit = el('a', '', 'Open the kit'); kit.href = 'kit/';
      hint.append(kit);
      stage.append(ol, hint);
    } else if (s.kind === 'title') {
      stage.append(el('p', 'kicker', `${pad(s.s.n)} · ${s.s.min} min`), el('h1', '', s.s.title), el('p', 'lead', s.s.lead));
    } else if (s.kind === 'close') {
      const a = el('a', '', 'Open the kit'); a.href = 'kit/';
      stage.append(el('p', 'kicker', 'After today'), el('h1', '', 'The kit stays online'), el('p', 'lead', 'Every command and prompt from today, for Claude Code and Codex.'), a);
    } else {
      const body = el('div', 'body');
      stage.append(el('p', 'kicker', `${pad(s.s.n)} · ${s.s.title}`), el('h2', '', s.sc.sub), body);
      R[s.sc.type](s.sc, body);
    }
    if (window.Sky) { Sky.morph((s.sc && s.sc.shape) || (s.s && s.s.shape) || s.shape); Sky.place(s.kind === 'scene' ? 'small' : 'big'); }
    bar.style.width = ((s.s ? s.s.n : s.kind === 'close' ? W.sessions.length : 0) / W.sessions.length) * 100 + '%';
    history.replaceState(null, '', `#${i}.${step}`);
    paintMeta();
  }

  function paintMeta() {
    const s = S[i].s;
    if (!s) { meta.textContent = ''; meta.className = ''; return; }
    const left = Math.round(s.min * 60 - (spent[s.n] || 0)), a = Math.abs(left);
    meta.textContent = `${pad(s.n)} / ${W.sessions.length}  ·  ${left < 0 ? '+' : ''}${Math.floor(a / 60)}:${pad(a % 60)}`;
    meta.className = left < 0 ? 'over' : left <= 120 ? 'warn' : '';
  }

  function go(n, atEnd) {
    if (i !== 0) back = i;
    i = Math.min(Math.max(n, 0), S.length - 1);
    step = atEnd ? maxStep(S[i]) : 0;
    render(true);
  }
  const next = () => (step < maxStep(S[i]) ? (step++, render()) : i < S.length - 1 && go(i + 1));
  const prev = () => (step > 0 ? (step--, render()) : i > 0 && go(i - 1, true));

  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === 'arrowright' || k === ' ' || k === 'pagedown') { e.preventDefault(); next(); }
    else if (k === 'arrowleft' || k === 'pageup') { e.preventDefault(); prev(); }
    else if (k === 'i') go(i === 0 ? back : 0);
    else if ('123'.includes(k)) { const b = $(`.pill[data-k="${k}"]`); b && b.click(); }
    else if (k === 't' && S[i].s) { spent[S[i].s.n] = 0; paintMeta(); }
  });
  $('#next').onclick = next;
  $('#prev').onclick = prev;

  // The countdown belongs to the session on screen, and never moves the slide itself.
  setInterval(() => {
    const now = performance.now(), s = S[i].s;
    if (s) spent[s.n] = (spent[s.n] || 0) + (now - last) / 1000;
    last = now;
    paintMeta();
  }, 250);

  step = Math.min(Math.max(h1, 0), maxStep(S[i]));
  render(true);
})();
