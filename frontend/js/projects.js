/**
 * projects.js — featured projects, paginated project grid, and the
 * project-details modal.
 */
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedProjects();
  loadProjectsPage(1);
  initModal();
});

/* ---------- Featured ---------- */
async function loadFeaturedProjects() {
  const container = document.getElementById('featured-projects');
  if (!container) return;
  try {
    const data = await Api.getFeaturedProjects();
    const results = data.results || data;
    if (!results.length) {
      container.innerHTML = '';
      container.closest('.featured-section')?.classList.add('hidden');
      return;
    }
    container.innerHTML = results.map(renderProjectCard).join('');
    attachCardListeners(container);
  } catch (err) {
    console.error(err);
  }
}

/* ---------- Paginated grid ---------- */
async function loadProjectsPage(page) {
  const container = document.getElementById('projects-grid');
  const paginationEl = document.getElementById('projects-pagination');
  container.innerHTML = renderSkeletonCards(3);

  try {
    const data = await Api.getProjects(page);
    currentPage = page;

    if (!data.results.length) {
      container.innerHTML = `<p class="empty-state">No projects to show yet.</p>`;
      paginationEl.innerHTML = '';
      return;
    }

    container.innerHTML = data.results.map(renderProjectCard).join('');
    attachCardListeners(container);
    renderPagination(paginationEl, data, page);
  } catch (err) {
    container.innerHTML = `<p class="error-state">Unable to load projects. Please try again later.</p>`;
    paginationEl.innerHTML = '';
    console.error(err);
  }
}

function renderSkeletonCards(count) {
  return Array.from({ length: count })
    .map(
      () => `
      <div class="project-card skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton skeleton-line" style="width:70%"></div>
        <div class="skeleton skeleton-line" style="width:90%"></div>
        <div class="skeleton skeleton-line" style="width:50%"></div>
      </div>`
    )
    .join('');
}

function renderProjectCard(project) {
  return `
    <article class="project-card fade-in-up" data-project-id="${project.id}">
      <div class="project-card-image">
        ${project.image ? `<img src="${project.image}" alt="${escapeHtml(project.title)}" loading="lazy" />` : `<div class="project-card-placeholder">${escapeHtml(project.title.slice(0, 1))}</div>`}
      </div>
      <div class="project-card-body">
        <h3>${escapeHtml(project.title)}</h3>
        <p class="project-card-desc">${escapeHtml(truncate(project.description, 110))}</p>
        <div class="skill-tags">
          ${project.technologies.slice(0, 4).map((t) => `<span class="skill-tag skill-tag--sm">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="project-card-actions">
          ${project.github_url ? `<a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">GitHub</a>` : ''}
          ${project.live_url ? `<a href="${project.live_url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">Live Demo</a>` : ''}
          <button class="btn btn-sm btn-primary view-details-btn" data-project-id="${project.id}">View Details</button>
        </div>
      </div>
    </article>`;
}

function attachCardListeners(container) {
  container.querySelectorAll('.view-details-btn').forEach((btn) => {
    btn.addEventListener('click', () => openProjectModal(btn.dataset.projectId));
  });
  initScrollAnimations();
}

function renderPagination(container, data, page) {
  const pageSize = data.results.length > 0 ? data.results.length : 6;
  const totalPages = Math.max(1, Math.ceil(data.count / (data.results.length || 6)));
  // Fallback: derive total pages from presence of next/previous when count math is imprecise.
  let pages = totalPages;
  if (!Number.isFinite(pages) || pages < 1) pages = 1;

  const buttons = [];
  buttons.push(
    `<button class="page-btn" ${!data.previous ? 'disabled' : ''} data-page="${page - 1}">← Previous</button>`
  );
  for (let i = 1; i <= pages; i++) {
    buttons.push(
      `<button class="page-btn page-number ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`
    );
  }
  buttons.push(
    `<button class="page-btn" ${!data.next ? 'disabled' : ''} data-page="${page + 1}">Next →</button>`
  );

  container.innerHTML = buttons.join('');
  container.querySelectorAll('.page-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      const targetPage = Number(btn.dataset.page);
      loadProjectsPage(targetPage);
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ---------- Modal ---------- */
function initModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');

  closeBtn.addEventListener('click', closeProjectModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProjectModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeProjectModal();
  });
}

async function openProjectModal(projectId) {
  const modal = document.getElementById('project-modal');
  const body = document.getElementById('modal-body');
  body.innerHTML = `<p class="loading-state">Loading project...</p>`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  try {
    const project = await Api.getProject(projectId);
    body.innerHTML = `
      ${project.image ? `<img class="modal-image" src="${project.image}" alt="${escapeHtml(project.title)}" />` : ''}
      <h2 id="modal-title">${escapeHtml(project.title)}</h2>
      <p class="modal-description">${escapeHtml(project.description)}</p>
      <div class="skill-tags">
        ${project.technologies.map((t) => `<span class="skill-tag">${escapeHtml(t)}</span>`).join('')}
      </div>
      <div class="project-card-actions">
        ${project.github_url ? `<a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">GitHub</a>` : ''}
        ${project.live_url ? `<a href="${project.live_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Live Demo</a>` : ''}
      </div>
    `;
    closeBtnFocus();
  } catch (err) {
    body.innerHTML = `<p class="error-state">Unable to load project details. Please try again later.</p>`;
    console.error(err);
  }
}

function closeBtnFocus() {
  document.getElementById('modal-close').focus();
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function truncate(text, max) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}
