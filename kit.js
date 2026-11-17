// Kit page: three switches (computer, tool, topic) decide which commands and prompts are shown.
(function () {
  const W = window.WORKSHOP;
  const state = { os: /win/i.test(navigator.platform || navigator.userAgent) ? 'win' : 'mac', tool: 'claude', topic: '0' };

  const addCopy = c => {
    const b = document.createElement('button');
    b.className = 'pill'; b.textContent = 'Copy';
    b.onclick = () => copyText(c.querySelector('pre').textContent, b);
    c.append(b);
  };
  const cmd = text => {
    const c = document.createElement('div'), pre = document.createElement('pre');
    c.className = 'cmd'; pre.textContent = text; c.append(pre); addCopy(c);
    return c;
  };

  const topics = document.querySelector('[data-topics]');
  W.topics.forEach((t, k) => {
    const b = document.createElement('button');
    b.className = 'pill'; b.dataset.key = 'topic'; b.dataset.set = k; b.textContent = t.t;
    topics.append(b);
  });
  document.querySelectorAll('.cmd').forEach(addCopy);

  const apply = () => {
    document.body.dataset.os = state.os;
    document.body.dataset.tool = state.tool;
    document.querySelectorAll('.switch button').forEach(b => b.setAttribute('aria-pressed', state[b.dataset.key] === b.dataset.set));
    // data-lines: one copy block per line, because slash commands run one at a time
    document.querySelectorAll('[data-prompt]').forEach(d => {
      const text = W.prompt(d.dataset.prompt, W.topics[+state.topic].t, state.tool);
      d.textContent = '';
      (d.hasAttribute('data-lines') ? text.split('\n') : [text]).forEach(t => d.append(cmd(t)));
    });
  };
  document.querySelectorAll('.switch button').forEach(b => (b.onclick = () => { state[b.dataset.key] = b.dataset.set; apply(); }));
  apply();
})();
