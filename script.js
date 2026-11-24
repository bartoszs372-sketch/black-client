'use strict';
// Wstaw adres HTTPS do zweryfikowanego wydania Black Client.
const DOWNLOAD_URL = '';
const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav-links');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const pointer = window.matchMedia('(pointer: fine)');
function setMenu(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
}
menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
document.addEventListener('click', e => { if (!nav.contains(e.target) && !menu.contains(e.target)) setMenu(false); });
try {
  if (DOWNLOAD_URL) {
    const url = new URL(DOWNLOAD_URL);
    if (url.protocol === 'https:') {
      const link = document.querySelector('#download-link');
      link.href = url.href; link.hidden = false;
      document.querySelector('#download-status').hidden = true;
    }
  }
} catch { /* Invalid URL: keep the unavailable state. */ }
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('visible'); observer.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  document.documentElement.classList.add('js');
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
const sections = [...document.querySelectorAll('main section[id]')];
const links = [...nav.querySelectorAll('a')];
const progress = document.querySelector('.progress');
let pending = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
  let active = sections[0].id;
  for (const section of sections) if (section.getBoundingClientRect().top <= 160) active = section.id;
  if (max > 0 && window.scrollY >= max - 3) active = sections[sections.length - 1].id;
  links.forEach(a => {
    const selected = a.hash === `#${active}`;
    a.classList.toggle('active', selected);
    if (selected) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
  });
  pending = false;
}
function scheduleScroll() { if (!pending) { pending = true; requestAnimationFrame(updateScroll); } }
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll); updateScroll();
const hero = document.querySelector('.hero');
const planet = document.querySelector('.hero-image');
hero.addEventListener('pointermove', e => {
  if (motion.matches || !pointer.matches) return;
  const r = hero.getBoundingClientRect();
  planet.style.setProperty('--shift-x', `${(e.clientX - r.left - r.width / 2) / r.width * 24}px`);
  planet.style.setProperty('--shift-y', `${(e.clientY - r.top - r.height / 2) / r.height * 20}px`);
});
hero.addEventListener('pointerleave', () => { planet.style.setProperty('--shift-x', '0px'); planet.style.setProperty('--shift-y', '0px'); });
document.querySelectorAll('.feature').forEach(card => card.addEventListener('pointermove', e => {
  if (motion.matches || !pointer.matches) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`); card.style.setProperty('--my', `${e.clientY - r.top}px`);
}));
const canvas = document.querySelector('.stars');
const ctx = canvas.getContext('2d');
if (ctx) {
  let width = 0, height = 0, particles = [], frame = 0, last = 0, inView = true;
  function resize() {
    const rect = hero.getBoundingClientRect(); width = rect.width; height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: Math.min(95, Math.max(25, Math.round(width / 16))) }, () => ({ x: Math.random() * width, y: Math.random() * height, radius: .5 + Math.random() * 1.3, speed: 4 + Math.random() * 12, phase: Math.random() * 6.28 }));
  }
  function render(now) {
    frame = 0;
    if (motion.matches || document.hidden || !inView) return;
    const dt = last ? Math.min((now - last) / 1000, .05) : 0; last = now;
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.y -= p.speed * dt; if (p.y < -3) { p.y = height + 3; p.x = Math.random() * width; }
      const alpha = .15 + .35 * (1 + Math.sin(now / 1600 + p.phase)) / 2;
      ctx.fillStyle = `rgba(105,255,178,${alpha})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
    }
    frame = requestAnimationFrame(render);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame); frame = 0; last = 0;
    if (!motion.matches && !document.hidden && inView) frame = requestAnimationFrame(render);
    else ctx.clearRect(0, 0, width, height);
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero); else window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); }).observe(hero);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  resize(); sync();
}
