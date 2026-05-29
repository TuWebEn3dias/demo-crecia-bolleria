const WHATSAPP_NUMBER = '5491168715058';
const QR_MENU_URL = 'https://tuweben3dias.github.io/demo-crecia-bolleria/docs/menu.pdf';

document.addEventListener('DOMContentLoaded', () => {

  // 1. NAVBAR SCROLL
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // 2. MOBILE TOGGLE
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // 3. INTERSECTION OBSERVER — FADE UP
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // 4. MENU FILTER
  const catBtns = document.querySelectorAll('.menu-cat-btn');
  const menuCards = document.querySelectorAll('.menu-card[data-category]');
  if (catBtns.length) {
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        menuCards.forEach(card => {
          if (cat === 'pasteleria' || card.dataset.category === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 5. RESERVA FORM — WHATSAPP
  const form = document.getElementById('reservaForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('reservaNombre').value.trim();
      const fecha = document.getElementById('reservaFecha').value;
      const personas = document.getElementById('reservaPersonas').value;
      const telefono = document.getElementById('reservaTelefono').value.trim();
      const mensaje = document.getElementById('reservaMensaje').value.trim();

      if (!nombre || !fecha || !personas || !telefono) return;

      let texto = `Hola! Me llamo ${nombre}.\nQuiero reservar para ${personas} personas el ${fecha}.\nMi teléfono: ${telefono}`;
      if (mensaje) texto += `\n\n${mensaje}`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`, '_blank');
    });
  }

  // 6. QR CODE (SIMPLIFIED SVG)
  const qrContainer = document.getElementById('qrContainer');
  if (qrContainer) {
    generateQR(qrContainer, QR_MENU_URL);
  }

  // 7. SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});

function generateQR(container, url) {
  const size = 140;
  const modules = 21;
  const moduleSize = size / modules;

  const seed = url.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pseudoRandom = () => {
    let x = Math.sin(seed + (arguments.length ? arguments[0] : 0)) * 10000;
    return x - Math.floor(x);
  };

  let matrix = Array(modules).fill().map(() => Array(modules).fill(false));

  // Finder patterns
  const finderPattern = (ox, oy) => {
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 7; c++)
        matrix[oy + r][ox + c] = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
  };
  finderPattern(0, 0);
  finderPattern(modules - 7, 0);
  finderPattern(0, modules - 7);

  // Timing patterns
  for (let i = 8; i < modules - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Data
  let dataIdx = 0;
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (matrix[r][c] === undefined) {
        matrix[r][c] = pseudoRandom(dataIdx++) > 0.5;
      }
    }
  }

  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${size}" height="${size}" fill="#FEF8F0" rx="8"/>`;
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (matrix[r][c]) {
        svg += `<rect x="${c * moduleSize}" y="${r * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="#D4815A" rx="1.5"/>`;
      }
    }
  }
  svg += `<circle cx="${size/2}" cy="${size/2}" r="8" fill="#FEF8F0"/>`;
  svg += `<text x="${size/2}" y="${size/2 + 3}" font-size="10" fill="#D4815A" text-anchor="middle" dominant-baseline="central" font-family="DM Sans, sans-serif" font-weight="700">CR</text>`;
  svg += `</svg>`;

  container.innerHTML = svg;
}
