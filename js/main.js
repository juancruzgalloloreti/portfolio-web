(function initPortfolio() {
  'use strict';

  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  initEpicCanvas();
  fillHero(data);
  fillAbout(data.about);
  fillProjects(data.projects);
  fillSkills(data.skillGroups);
  fillAutomations(data.automations);
  fillContacts(data.profile);
  fillFooter(data.footer);
  enableReveal();
  enableCardGlow();
  initMobileMenu();
})();

function initEpicCanvas() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  particles = [];
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2,
      a: Math.random() * 0.5 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    
    // Draw particles
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.a * 0.5})`;
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${(100 - dist) / 100 * 0.1})`;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
}

function enableCardGlow() {
  const cards = document.querySelectorAll(".card-epic");
  cards.forEach(card => {
    let glow = card.querySelector('.card-glow');
    if (!glow) {
      glow = document.createElement('div');
      glow.className = 'card-glow';
      card.appendChild(glow);
    }
    
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isSafeHttpUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function fillHero(data) {
  document.getElementById("hero-name").textContent = data.profile.name;
  document.getElementById("hero-location").textContent = data.profile.location;
  document.getElementById("hero-tagline").textContent = data.profile.tagline;

  const pointsEl = document.getElementById("hero-points");
  (data.heroPoints || []).forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    pointsEl.append(li);
  });
}

function fillAbout(aboutItems) {
  const aboutGrid = document.getElementById("about-grid");
  (aboutItems || []).forEach((item, i) => {
    const article = document.createElement("article");
    article.className = "about-card card-epic";
    const h3 = document.createElement("h3");
    h3.textContent = item.title;
    const p = document.createElement("p");
    p.textContent = item.text;
    article.append(h3, p);
    aboutGrid.append(article);
  });
}

function fillProjects(projects) {
  const projectGrid = document.getElementById("project-grid");

  (projects || []).forEach((project, i) => {
    const article = document.createElement("article");
    article.className = "project-card card-epic";

    const statusClass = project.statusType === "live" ? "live" : "private";
    const safeProjectUrl = isSafeHttpUrl(project.url) ? project.url.trim() : "";
    const linkHtml = safeProjectUrl
      ? `<a class="project-link" href="${escapeHtml(safeProjectUrl)}" target="_blank" rel="noreferrer noopener">${escapeHtml(project.urlLabel)}</a>`
      : `<span class="project-link" href="">${escapeHtml(project.urlLabel)}</span>`;

    article.innerHTML = `
      <figure class="project-media">
        <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.name)}" loading="lazy" />
      </figure>
      <div class="project-content">
        <div class="project-top">
          <h3>${escapeHtml(project.name)}</h3>
          <span class="badge ${statusClass}">${escapeHtml(project.status)}</span>
        </div>
        <p>${escapeHtml(project.description)}</p>
        ${linkHtml}
      </div>
    `;

    const image = article.querySelector("img");
    image.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "fallback-image";
      fallback.textContent = project.fallbackLabel;
      image.replaceWith(fallback);
    });

    projectGrid.append(article);
  });
}

function fillSkills(skillGroups) {
  const groupsEl = document.getElementById("skills-groups");

  (skillGroups || []).forEach((group, i) => {
    const article = document.createElement("article");
    article.className = "skills-group card-epic";

    const items = (group.items || [])
      .map((item) => {
        return `<li><i>✓</i>${escapeHtml(item.label)}</li>`;
      })
      .join("");

    article.innerHTML = `<h3>${escapeHtml(group.title)}</h3><ul class="skills-list">${items}</ul>`;
    groupsEl.append(article);
  });
}

function fillAutomations(items) {
  const list = document.getElementById("automation-list");
  (items || []).forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "card-epic";
    li.textContent = item;
    list.append(li);
  });
}

function fillContacts(profile) {
  const emailSubject = encodeURIComponent("Consulta por desarrollo");
  const emailBody = encodeURIComponent(
    "Hola Juan, vi tu portfolio y quiero hablar sobre un proyecto."
  );
  const mailtoAddr = String(profile.email || "").trim();
  const links = [
    {
      title: "Email",
      value: profile.email,
      href: `mailto:${mailtoAddr}?subject=${emailSubject}&body=${emailBody}`,
      external: false,
    },
  ];

  if (isSafeHttpUrl(profile.whatsapp)) {
    links.push({
      title: "WhatsApp",
      value: profile.phone,
      href: profile.whatsapp.trim(),
      external: true,
    });
  }

  if (profile.github && isSafeHttpUrl(profile.github)) {
    links.push({
      title: "GitHub",
      value: "Ver perfil",
      href: profile.github.trim(),
      external: true,
    });
  }

  const contactLinks = document.getElementById("contact-links");
  links.forEach((entry, i) => {
    const a = document.createElement("a");
    a.className = "card-epic";
    a.href = entry.href;
    if (entry.external) {
      a.target = "_blank";
      a.rel = "noreferrer noopener";
    }
    const titleSpan = document.createElement("span");
    titleSpan.className = "contact-link-title";
    titleSpan.textContent = entry.title;
    const valueSpan = document.createElement("span");
    valueSpan.className = "contact-link-value";
    valueSpan.textContent = entry.value;
    a.append(titleSpan, valueSpan);
    contactLinks.append(a);
  });
}

function fillFooter(text) {
  document.getElementById("footer-copy").textContent = text;
}

function enableReveal() {
  const sections = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealAll = () => {
    sections.forEach((s) => s.classList.add("in-view"));
    document.querySelectorAll(".reveal-stagger").forEach((s) => s.classList.add("in-view"));
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          const stagger = entry.target.querySelector(".reveal-stagger");
          if (stagger) stagger.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((node) => observer.observe(node));
}

function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  const links = nav.querySelectorAll('a');

  if (!toggle || !nav) return;

  const toggleMenu = () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !isExpanded);
    toggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  };

  toggle.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}
