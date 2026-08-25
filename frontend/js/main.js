/**
 * main.js — navigation, theme toggle, scroll animations, back-to-top,
 * hero/about/skills/experience/education rendering.
 */
// import {
//   FaGithub,
//   FaLinkedin,
//   FaInstagram,
//   FaEnvelope
// } from "react-icons/fa";
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initBackToTop();
  initScrollAnimations();
  loadProfile();
  loadSkills();
  loadExperience();
  loadEducation();
});

/* ---------- Theme (dark / light) ---------- */
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });
}

function updateThemeIcon(theme) {
  const toggle = document.getElementById('theme-toggle');
toggle.textContent = theme === 'dark' ? '◐' : '◑';
  toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

/* ---------- Navigation ---------- */
function initNav() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Highlight active section on scroll using IntersectionObserver.
  const sections = document.querySelectorAll('main section[id]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => {
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ---------- Scroll-in animations ---------- */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-in-up');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((el) => observer.observe(el));
}

/* ---------- Profile / Hero / About ---------- */
async function loadProfile() {
  const heroContainer = document.getElementById('hero-content');
  const aboutContainer = document.getElementById('about-content');
  const socialContainers = document.querySelectorAll('.social-links');

  try {
    const profile = await Api.getProfile();
    renderHero(heroContainer, profile);
    renderAbout(aboutContainer, profile);
    socialContainers.forEach((el) => renderSocialLinks(el, profile));
    document.title = `${profile.name} — ${profile.title}`;
  } catch (err) {
    heroContainer.innerHTML = `<p class="error-state">Unable to load profile. Please try again later.</p>`;
    aboutContainer.innerHTML = `<p class="error-state">Unable to load profile. Please try again later.</p>`;
    console.error(err);
  }
}

function renderHero(container, profile) {
  container.innerHTML = `
    ${profile.profile_image ? `<img class="hero-photo" src="${profile.profile_image}" alt="${escapeHtml(profile.name)}" />` : `<div class="hero-photo hero-photo--placeholder" aria-hidden="true">${initials(profile.name)}</div>`}
    <p class="hero-greeting">Hi, I'm</p>
    <h1 class="hero-name">${escapeHtml(profile.name)}</h1>
    <p class="hero-title">${escapeHtml(profile.title)}</p>
    <p class="hero-intro">${escapeHtml(profile.short_intro || profile.bio)}</p>
    <div class="hero-actions">
      <a href="#projects" class="btn btn-primary">View My Work</a>
      <a href="#contact" class="btn btn-outline">Contact Me</a>
    </div>
  `;
}

function renderAbout(container, profile) {
  container.innerHTML = `
    <p class="about-bio">${escapeHtml(profile.bio)}</p>
    <ul class="about-meta">
      ${profile.location ? `<li><strong>Location:</strong> ${escapeHtml(profile.location)}</li>` : ''}
      <li><strong>Email:</strong> <a href="mailto:${profile.email}">${escapeHtml(profile.email)}</a></li>
      ${profile.phone ? `<li><strong>Phone:</strong> ${escapeHtml(profile.phone)}</li>` : ''}
      ${profile.secondary_title ? `<li><strong>Focus:</strong> ${escapeHtml(profile.secondary_title)}</li>` : ''}
    </ul>
  `;
}

function renderSocialLinks(container, profile) {
  const links = [
    profile.github_url && { label: 'GitHub', url: profile.github_url, icon: '<i class="fa-brands fa-square-github"></i>' },
    profile.linkedin_url && { label: 'LinkedIn', url: profile.linkedin_url, icon: '<i class="fa-brands fa-linkedin"></i>' },
    profile.instagram_url && { label: 'Instagram', url: profile.instagram_url, icon: '<i class="fa-brands fa-instagram"></i>' },
    profile.email && { label: 'Email', url: `mailto:${profile.email}`, icon: '<i class="fa-solid fa-envelope"></i>' },
  ].filter(Boolean);

  container.innerHTML = links
    .map(
      (l) =>
        `<a href="${l.url}" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="${l.label}"><span aria-hidden="true">${l.icon}</span></a>`
    )
    .join('');
}

function initials(name) {
  return (name || '')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/* ---------- Skills ---------- */
async function loadSkills() {
  const container = document.getElementById('skills-content');
  container.innerHTML = `<p class="loading-state">Loading skills...</p>`;
  try {
    const skills = await Api.getSkills();
    if (!skills.length) {
      container.innerHTML = `<p class="empty-state">No skills added yet.</p>`;
      return;
    }
    const grouped = groupBy(skills, 'category');
    container.innerHTML = Object.entries(grouped)
      .map(
        ([category, items]) => `
        <div class="skill-category fade-in-up">
          <h3 class="skill-category-title">${labelForCategory(category)}</h3>
          <div class="skill-tags">
            ${items.map((s) => `<span class="skill-tag">${escapeHtml(s.name)}</span>`).join('')}
          </div>
        </div>`
      )
      .join('');
    initScrollAnimations();
  } catch (err) {
    container.innerHTML = `<p class="error-state">Unable to load skills. Please try again later.</p>`;
    console.error(err);
  }
}

function labelForCategory(cat) {
  const map = {
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Database',
    tools: 'Tools & Version Control',
    languages: 'Languages',
    concepts: 'Concepts',
    other: 'Other',
  };
  return map[cat] || cat;
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
}

/* ---------- Experience ---------- */
/* ---------- Experience ---------- */
async function loadExperience() {
  const container = document.getElementById('experience-content');

  if (!container) {
    console.error('experience-content element not found.');
    return;
  }

  container.innerHTML = `
    <p class="loading-state">Loading experience...</p>
  `;

  try {
    const items = await Api.getExperience();

    console.log('Experience API response:', items);

    if (!Array.isArray(items) || items.length === 0) {
      container.innerHTML = `
        <p class="empty-state">No experience added yet.</p>
      `;
      return;
    }

    container.innerHTML = `
      <div class="timeline">
        ${items.map(renderExperienceItem).join('')}
      </div>
    `;

    initScrollAnimations();

  } catch (err) {
    console.error('Experience loading error:', err);

    container.innerHTML = `
      <p class="error-state">
        Unable to load experience. Please try again later.
      </p>
    `;
  }
}

function renderExperienceItem(exp) {
  // End date
  const end = exp.currently_working
    ? 'Present'
    : formatDate(exp.end_date);

  // Description → bullet points
  const bullets = (exp.description || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => `
      <li>${escapeHtml(line)}</li>
    `)
    .join('');

  // Technologies
  const technologies = Array.isArray(exp.technologies)
    ? exp.technologies
    : [];

  const technologyTags = technologies.length
    ? `
      <div class="skill-tags">
        ${technologies.map(technology => `
          <span class="skill-tag skill-tag--sm">
            ${escapeHtml(technology)}
          </span>
        `).join('')}
      </div>
    `
    : '';

  return `
    <div class="timeline-item fade-in-up">

      <div class="timeline-dot"></div>

      <div class="timeline-content">

        <h3>
          ${escapeHtml(exp.position)}
        </h3>

        <p class="timeline-subtitle">
          ${escapeHtml(exp.company)}
          ·
          ${formatDate(exp.start_date)}
          –
          ${end}
        </p>

        ${
          bullets
            ? `<ul class="timeline-bullets">${bullets}</ul>`
            : ''
        }

        ${technologyTags}

      </div>

    </div>
  `;
}
/* ---------- Education ---------- */
async function loadEducation() {
  const container = document.getElementById('education-content');
  container.innerHTML = `<p class="loading-state">Loading education...</p>`;
  try {
    const items = await Api.getEducation();
    if (!items.length) {
      container.innerHTML = `<p class="empty-state">No education added yet.</p>`;
      return;
    }
    container.innerHTML = items.map(renderEducationItem).join('');
    initScrollAnimations();
  } catch (err) {
    container.innerHTML = `<p class="error-state">Unable to load education. Please try again later.</p>`;
    console.error(err);
  }
}

function renderEducationItem(edu) {
  return `
    <div class="education-card fade-in-up">
      <h3>${escapeHtml(edu.degree)} ${edu.field ? `— ${escapeHtml(edu.field)}` : ''}</h3>
      <p class="timeline-subtitle">${escapeHtml(edu.institution)}</p>
      <p class="education-years">${edu.start_year} – ${escapeHtml(String(edu.end_year))}</p>
      ${edu.description ? `<p>${escapeHtml(edu.description)}</p>` : ''}
    </div>`;
}

/* ---------- Helpers ---------- */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}
