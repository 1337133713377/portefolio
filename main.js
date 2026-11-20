// ⇩ Ton pseudo GitHub : projets, stack, stats et activité en découlent.
const GITHUB_USER = '1337133713377';
// Dépôts présentés à la main dans la section « Suite REKA » : exclus de « Autres projets ».
const REKA_REPOS = ['reka', 'Rekataskbar', 'reka.help', 'voicemeeterBG'];
// Outils affichés dans « Technologies » en plus des langages détectés sur GitHub.
// Personnes affichées dans « Réseau » : pseudo GitHub, prénom affiché, lien avec toi
// et, si tu veux, une courte bio (sinon celle de leur profil GitHub est utilisée).
const NETWORK = [
  { login: 'Underspace1', name: 'Mikael', role: 'Collaborateur' },
];
const EXTRA_TECH = ['Windows API', 'Voicemeeter API', 'VST2 / VST3 / CLAP', 'REAPER', 'Discord RPC', 'three.js', 'Git', 'GitHub Actions', 'Linux'];

const $ = (s) => document.querySelector(s);
const el = (tag, props = {}, ...kids) => {
  const n = Object.assign(document.createElement(tag), props);
  n.append(...kids);
  return n;
};
// GitHub data is user-controlled: only allow http(s) links (blocks javascript: URLs).
const safeUrl = (u) => {
  try { const url = new URL(u.includes('://') ? u : 'https://' + u); return /^https?:$/.test(url.protocol) ? url.href : null; }
  catch { return null; }
};

/* ---------- Theme ---------- */
$('#theme-toggle').addEventListener('click', () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach((s) => io.observe(s));

/* ---------- Pixel mosaic avatar ---------- */
(function pixelCard() {
  const card = $('#pixel-card');
  const layer = card.querySelector('.pixel-card__pixels');
  const hint = card.querySelector('.pixel-card__hint');
  const GRID = 12, DURATION = 300; // ms for each phase (cover, then uncover)
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const size = 100 / GRID;
  const pixels = [];
  for (let r = 0; r < GRID; r++) for (let c = 0; c < GRID; c++) {
    const p = el('div', { className: 'pixel' });
    Object.assign(p.style, { width: size + '%', height: size + '%', left: c * size + '%', top: r * size + '%' });
    layer.append(p);
    pixels.push(p);
  }
  let timers = [];
  let active = false;

  const shuffled = () => pixels.slice().sort(() => Math.random() - 0.5);
  const run = (show) => {
    const step = DURATION / pixels.length;
    shuffled().forEach((p, i) => timers.push(setTimeout(() => { p.style.display = show ? 'block' : 'none'; }, i * step)));
  };

  function setActive(on) {
    if (on === active) return;
    active = on;
    hint.classList.remove('is-visible');
    card.setAttribute('aria-pressed', String(on));
    timers.forEach(clearTimeout); timers = [];
    if (reduced) { card.classList.toggle('is-active', on); return; }
    run(true); // cover with pixels in random order
    timers.push(setTimeout(() => { card.classList.toggle('is-active', on); run(false); }, DURATION));
  }

  hint.classList.add('is-visible');
  if (matchMedia('(hover: hover)').matches) {
    card.addEventListener('mouseenter', () => setActive(true));
    card.addEventListener('mouseleave', () => setActive(false));
  } else {
    hint.textContent = 'Toucher pour révéler';
    card.addEventListener('click', () => setActive(!active));
  }
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(!active); }
  });
})();

/* ---------- GitHub data ---------- */
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', HTML: '#e34c26', CSS: '#563d7c',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555555', 'C#': '#178600', PHP: '#4F5D95', Rust: '#dea584',
  Go: '#00ADD8', Shell: '#89e051', Ruby: '#701516', Kotlin: '#A97BFF', Swift: '#F05138', Dart: '#00B4AB',
  Vue: '#41b883', Svelte: '#ff3e00', Lua: '#000080', 'Jupyter Notebook': '#DA5B0B', SCSS: '#c6538c',
};
const ICONS = {
  github: '<path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" fill="none" stroke="currentColor" stroke-width="2"/>',
  mail: '<path d="M2 5h20v14H2zM2 5l10 8 10-8" fill="none" stroke="currentColor" stroke-width="2"/>',
  x: '<path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8-9.2L1 2h7l4.8 6.3zm-1.2 18h1.9L7.4 4H5.4z"/>',
};
const icon = (name, href, label) => {
  const a = el('a', { href, target: '_blank', rel: 'noopener', ariaLabel: label, title: label });
  a.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">${ICONS[name]}</svg>`;
  return a;
};

// Sans compte, l'API GitHub limite chaque visiteur à 60 requêtes par heure (3 par visite ici).
// Les réponses sont donc gardées 1 h dans le navigateur, et réutilisées si GitHub refuse.
const CACHE_TTL = 60 * 60 * 1000;
// Une même URL demandée par deux sections ne part qu'une fois.
const inflight = new Map();
function getJSON(url) {
  if (!inflight.has(url)) inflight.set(url, fetchJSON(url));
  return inflight.get(url);
}
async function fetchJSON(url) {
  const key = 'gh-cache:' + url;
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem(key)); } catch (e) {}
  if (cached && Date.now() - cached.t < CACHE_TTL) return cached.data;
  try {
    const r = await fetch(url);
    if (!r.ok) throw Object.assign(new Error(`${r.status} ${url}`), { status: r.status });
    const data = await r.json();
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), data })); } catch (e) {}
    return data;
  } catch (e) {
    if (cached) return cached.data; // périmé, mais mieux que rien
    throw e;
  }
}

async function loadGitHub() {
  const profileUrl = `https://github.com/${encodeURIComponent(GITHUB_USER)}`;
  $('#all-repos').href = profileUrl + '?tab=repositories';
  let user, repos;
  try {
    [user, repos] = await Promise.all([
      getJSON(`https://api.github.com/users/${encodeURIComponent(GITHUB_USER)}`),
      getJSON(`https://api.github.com/users/${encodeURIComponent(GITHUB_USER)}/repos?per_page=100&sort=pushed`),
    ]);
  } catch (e) {
    console.error(e);
    const limited = e.status === 403 || e.status === 429;
    $('#project-list').replaceChildren(el('p', { className: 'muted' },
      limited ? 'GitHub limite temporairement le nombre de requêtes. Réessaie dans quelques minutes, ou ' : 'Les projets ne peuvent pas être chargés pour le moment. ',
      el('a', { href: profileUrl + '?tab=repositories', target: '_blank', rel: 'noopener', className: 'accent', textContent: limited ? 'vois-les directement sur GitHub ›' : 'Voir mes projets sur GitHub ›' })));
    $('#stack').hidden = true;
    $('#socials').replaceChildren(icon('github', profileUrl, 'GitHub'));
    $('#contact-actions').replaceChildren(el('a', { className: 'btn', href: profileUrl, target: '_blank', rel: 'noopener', textContent: 'Mon GitHub ›' }));
    return;
  }

  // Name and bio are written in index.html (GitHub name is the brand, not the person).
  const socials = [icon('github', profileUrl, 'GitHub')];
  const blog = user.blog && safeUrl(user.blog);
  if (blog) socials.push(icon('link', blog, 'Site web'));
  if (user.twitter_username) socials.push(icon('x', `https://x.com/${encodeURIComponent(user.twitter_username)}`, 'X / Twitter'));
  if (user.email) socials.push(icon('mail', `mailto:${user.email}`, 'Email'));
  $('#socials').replaceChildren(...socials);

  const own = repos.filter((r) => !r.fork);
  $('#stat-repos').textContent = user.public_repos;
  $('#stat-stars').textContent = own.reduce((s, r) => s + r.stargazers_count, 0);


  // Projects: own repos, most starred first, then most recently pushed
  const top = own
    .filter((r) => r.name !== user.login && !REKA_REPOS.includes(r.name)) // skip profile README + REKA suite
    .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 6);
  $('#project-list').replaceChildren(...(top.length ? top.map(projectCard) : [el('p', { className: 'muted', textContent: 'Aucun projet public pour le moment.' })]));

  // Stack: GitHub languages (most used first), then the hand-picked tools
  const count = {};
  own.forEach((r) => { if (r.language) count[r.language] = (count[r.language] || 0) + 1; });
  const tech = [...Object.keys(count).sort((a, b) => count[b] - count[a]), ...EXTRA_TECH];
  if (tech.length) {
    const half = Math.ceil(tech.length / 2);
    const rows = tech.length > 6 ? [tech.slice(0, half), tech.slice(half)] : [tech];
    $('#marquee').replaceChildren(...rows.map((row) => {
      const chips = () => row.map((t) => el('span', { className: 'chip' }, ...(LANG_COLORS[t] ? [dot(t)] : []), t));
      // content duplicated so the -50% translate loops seamlessly
      return el('div', { className: 'marquee__row' }, ...chips(), ...chips(), ...chips(), ...chips());
    }));
  } else {
    $('#stack').hidden = true;
  }

  // Contact
  const actions = [el('a', { className: 'btn', href: profileUrl, target: '_blank', rel: 'noopener', textContent: 'Mon GitHub ›' })];
  if (user.email) actions.push(el('a', { className: 'btn btn--ghost', href: `mailto:${user.email}`, textContent: user.email }));
  if (blog) actions.push(el('a', { className: 'btn btn--ghost', href: blog, target: '_blank', rel: 'noopener', textContent: new URL(blog).hostname }));
  $('#contact-actions').replaceChildren(...actions);
}

const dot = (lang) => {
  const d = el('span', { className: 'dot' });
  d.style.background = LANG_COLORS[lang] || 'var(--muted)';
  return d;
};

function projectCard(r) {
  const meta = el('div', { className: 'project__meta' });
  if (r.language) meta.append(el('span', {}, dot(r.language), r.language));
  meta.append(el('span', { textContent: `★ ${r.stargazers_count}` }));
  const links = el('div', { className: 'project__links' },
    el('a', { href: r.html_url, target: '_blank', rel: 'noopener', textContent: 'Code ↗' }));
  const home = r.homepage && safeUrl(r.homepage);
  if (home) links.append(el('a', { href: home, target: '_blank', rel: 'noopener', textContent: 'Voir le site ↗' }));
  return el('article', { className: 'project' },
    el('h3', { textContent: r.name }),
    meta,
    el('p', { textContent: r.description || 'Pas de description.' }),
    links);
}

async function loadRekaRelease() {
  try {
    const rels = await getJSON(`https://api.github.com/repos/${encodeURIComponent(GITHUB_USER)}/reka/releases?per_page=100`);
    const total = rels.flatMap((r) => r.assets).filter((a) => /\.exe$/i.test(a.name)).reduce((s, a) => s + a.download_count, 0);
    $('#stat-downloads').textContent = total;
    if (rels[0]) $('#reka-version').textContent = `· ${rels[0].tag_name}`;
  } catch (e) {
    console.error(e);
  }
}

async function loadContributions() {
  try {
    const data = await getJSON(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(GITHUB_USER)}?y=last`);
    const days = data.contributions;
    const pad = new Date(days[0].date + 'T00:00:00').getDay(); // align first column on Sunday
    const cells = Array.from({ length: pad }, () => el('i', { style: 'visibility:hidden' }));
    days.forEach((d) => {
      const c = el('i', { title: `${d.count} contribution${d.count > 1 ? 's' : ''} le ${d.date}` });
      c.dataset.l = d.level;
      cells.push(c);
    });
    $('#graph').replaceChildren(...cells);
    // month label above the first week column where that month starts (cell 9px + gap 2px)
    const months = [];
    let last = -1;
    days.forEach((d, i) => {
      const m = new Date(d.date + 'T00:00:00').getMonth();
      const col = Math.floor((i + pad) / 7);
      if (m !== last && (i === 0 ? new Date(d.date + 'T00:00:00').getDate() <= 7 : true)) {
        months.push(el('span', { textContent: new Date(d.date + 'T00:00:00').toLocaleDateString('fr-FR', { month: 'short' }), style: `left:${col * 11}px` }));
      }
      last = m;
    });
    $('#months').replaceChildren(...months);
    const total = data.total.lastYear;
    const link = $('#contrib-total');
    link.textContent = `${total.toLocaleString('fr-FR')} contribution${total > 1 ? 's' : ''} sur la dernière année`;
    link.href = `https://github.com/${encodeURIComponent(GITHUB_USER)}`;
    $('.activity__scroll').scrollLeft = 1e6; // show the most recent weeks first on narrow screens
  } catch (e) {
    console.error(e);
    $('#activity').hidden = true;
  }
}

/* ---------- Réseau ---------- */
const ghApi = (login) => `https://api.github.com/users/${encodeURIComponent(login)}`;
const contribApi = (login) => `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(login)}?y=last`;

function personCard({ login, name, bio, avatar, me }) {
  const url = `https://github.com/${encodeURIComponent(login)}`;
  const labels = { repos: 'Dépôts publics', stars: 'Étoiles', followers: 'Abonnés', contribs: 'Contributions sur 1\u00a0an' };
  const nums = {};
  const stats = Object.entries(labels).map(([k, label]) =>
    el('div', { className: 'person__stat' }, (nums[k] = el('b', { textContent: '–' })), el('span', { textContent: label })));
  const bioEl = el('p', { className: 'person__bio', textContent: bio || '' });
  const cta = el('a', { className: 'btn btn--ghost person__cta', href: url, target: '_blank', rel: 'noopener' });
  cta.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">${ICONS.github}</svg>Voir le profil <span aria-hidden="true">›</span>`;
  const card = el('article', { className: 'person' + (me ? ' person--me' : '') },
    el('a', { className: 'person__avatar', href: url, target: '_blank', rel: 'noopener', tabIndex: -1 },
      el('img', { src: avatar || `https://github.com/${encodeURIComponent(login)}.png?size=200`, alt: `Avatar de ${name}`, width: 88, height: 88, loading: 'lazy' })),
    el('h3', { textContent: name }),
    el('a', { className: 'person__login', href: url, target: '_blank', rel: 'noopener', textContent: '@' + login }),
    bioEl,
    el('div', { className: 'person__stats' }, ...stats),
    cta);
  fillPerson(login, nums, bio ? null : bioEl);
  return card;
}

async function fillPerson(login, nums, bioEl) {
  const [user, repos, contrib] = await Promise.allSettled([
    getJSON(ghApi(login)), getJSON(ghApi(login) + '/repos?per_page=100&sort=pushed'), getJSON(contribApi(login)),
  ]);
  const fr = (n) => n.toLocaleString('fr-FR');
  if (user.status === 'fulfilled') {
    nums.repos.textContent = fr(user.value.public_repos);
    nums.followers.textContent = fr(user.value.followers);
    if (bioEl && user.value.bio) bioEl.textContent = user.value.bio;
  }
  if (repos.status === 'fulfilled') nums.stars.textContent = fr(repos.value.filter((r) => !r.fork).reduce((s, r) => s + r.stargazers_count, 0));
  if (contrib.status === 'fulfilled') nums.contribs.textContent = fr(contrib.value.total.lastYear);
}

function loadNetwork() {
  if (!NETWORK.length) { $('#network').hidden = true; return; }
  const me = personCard({ login: GITHUB_USER, name: 'Julien ROULLET', bio: 'Étudiant Epitech · Créateur de REKA', avatar: 'assets/avatar.webp', me: true });
  me.style.gridRow = `1 / span ${NETWORK.length}`;
  const rows = NETWORK.flatMap((p) => [
    el('div', { className: 'network__link' }, el('span', { className: 'network__line', ariaHidden: 'true' }), el('span', { className: 'network__role', textContent: p.role })),
    personCard(p),
  ]);
  $('#network-list').replaceChildren(me, ...rows);
}

$('#year').textContent = new Date().getFullYear();
loadGitHub();
loadRekaRelease();
loadContributions();
loadNetwork();
