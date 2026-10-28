(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const store = { get: k => { try { return localStorage.getItem(k) } catch (e) { return null } }, set: (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} } };

  // Footer year
  $('#year').textContent = new Date().getFullYear();

  // Theme toggle
  $('#theme').addEventListener('click', () => {
    const dark = (root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
    root.dataset.theme = dark ? 'light' : 'dark';
    store.set('theme', root.dataset.theme);
  });

  // Mobile menu
  const menu = $('#menu'), burger = $('#burger');
  const setMenu = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  // Header border on scroll
  const nav = $('#nav');
  addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 10), { passive: true });

  // Active link while scrolling
  const links = $$('nav a');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section').forEach(s => spy.observe(s));

  // Count-up for hero stat
  const c = $('#count'), to = +c.dataset.to;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) c.textContent = to;
  else { let n = 0; const t = setInterval(() => { c.textContent = ++n; if (n >= to) clearInterval(t); }, 130); }

  // Portfolio filter
  $$('.filters button').forEach(b => b.addEventListener('click', () => {
    $$('.filters button').forEach(x => x.classList.toggle('on', x === b));
    $$('.card').forEach(card => card.hidden = b.dataset.f !== 'all' && card.dataset.c !== b.dataset.f);
  }));

  // Contact form: validate, then open the visitor's email app
  const form = $('#form'), msg = $('#msg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('input,textarea', form).forEach(f => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.setAttribute('aria-invalid', bad); if (bad) ok = false;
    });
    if (!ok) { msg.style.color = '#e5484d'; msg.textContent = 'Please fill in every field with a valid email.'; return; }
    const d = new FormData(form);
    const body = `${d.get('message')}\n\nFrom: ${d.get('name')} (${d.get('email')})`;
    location.href = `mailto:dhanielflores@gmail.com?subject=${encodeURIComponent('Portfolio message from ' + d.get('name'))}&body=${encodeURIComponent(body)}`;
    msg.style.color = 'var(--muted)'; msg.textContent = 'Opening your email app to send the message.';
  });
})();
