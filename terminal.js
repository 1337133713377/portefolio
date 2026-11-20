// Mini terminal caché : touche ² / ` ou ~ pour l'ouvrir, Échap pour fermer.
(() => {
  const GH = 'https://github.com/1337133713377';
  const box = document.createElement('div');
  box.className = 'term';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Terminal');
  box.innerHTML = '<div class="term__bar"><span></span><span></span><span></span><b>julien@portfolio:~</b></div>' +
    '<div class="term__out" aria-live="polite"></div>' +
    '<label class="term__line"><span class="term__ps">$</span><input spellcheck="false" autocomplete="off" aria-label="Commande"></label>';
  document.body.append(box);
  const out = box.querySelector('.term__out');
  const input = box.querySelector('input');
  const history = [];
  let hi = 0;

  const print = (text, cls) => {
    const p = document.createElement('div');
    if (cls) p.className = cls;
    p.textContent = text;
    out.append(p);
    out.scrollTop = out.scrollHeight;
  };
  const go = (sel) => { close(); document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' }); };

  const cmds = {
    help: () => print('Commandes : about, reka, projects, stack, reseau, contact, github, theme, clear, exit'),
    about: () => print('Julien ROULLET, étudiant à Epitech (Paris). Je développe REKA, une console de mixage pour Windows. Python, C, C#.'),
    whoami: () => print('visiteur (mais bienvenue !)'),
    reka: () => go('#reka'),
    projects: () => go('#projects'),
    stack: () => go('#stack'),
    reseau: () => go('#network'),
    contact: () => go('#contact'),
    github: () => { print('Ouverture de GitHub…'); window.open(GH, '_blank', 'noopener'); },
    theme: () => { document.querySelector('#theme-toggle')?.click(); print('Thème changé.'); },
    ls: () => print('reka/  projects/  stack/  contact/  secret.txt'),
    'cat secret.txt': () => print('Bien joué ! Tu as trouvé le terminal caché 🎉'),
    sudo: () => print("Nice try. Tu n'es pas dans le fichier sudoers.", 'term__err'),
    date: () => print(new Date().toLocaleString('fr-FR')),
    clear: () => out.replaceChildren(),
    exit: () => close(),
  };

  const run = (raw) => {
    const line = raw.trim();
    print('$ ' + line, 'term__cmd');
    if (!line) return;
    history.push(line); hi = history.length;
    const fn = cmds[line.toLowerCase()] || cmds[line.toLowerCase().split(/\s+/)[0]];
    fn ? fn() : print(`commande introuvable : ${line}. Tape "help".`, 'term__err');
  };

  function open() {
    box.hidden = false;
    if (!out.childElementCount) print('Bienvenue ! Tape "help" pour la liste des commandes.');
    input.focus();
  }
  function close() { box.hidden = true; }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp' && hi > 0) { input.value = history[--hi]; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { hi = Math.min(hi + 1, history.length); input.value = history[hi] || ''; }
    else if (e.key === 'Escape') close();
  });

  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if (['²', '`', '~'].includes(e.key) && (!typing || e.target === input)) {
      e.preventDefault();
      box.hidden ? open() : close();
    }
  });
})();
