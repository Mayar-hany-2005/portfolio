// ==========================================================================
   // PORTFOLIO LOGIC & CONTROLLER (FOR MAYAR HANY)
   // ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initJourneyTimeline();
  initProjects();
  initContactActions();
});

/* ==========================================================================
   1. THEME SWITCHING (DARK / LIGHT MODE)
   ========================================================================== */

function initTheme() {
  const themeBtn = document.getElementById('theme-btn');
  if (!themeBtn) return;

  // Retrieve user preference, falling back to system options
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const activeTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('portfolio-theme', activeTheme);
  });
}

/* ==========================================================================
   3. INTERACTIVE TIMELINE / JOURNEY LOGIC
   ========================================================================== */

const journeyData = {
  1: {
    icon: '01',
    title: 'Academic Foundation',
    desc: 'Pursuing a Bachelor\'s degree in Business Intelligence & Analytical Systems at Helwan National University, focusing on Database Systems, Data Structures, and Machine Learning.'
  },
  2: {
    icon: '02',
    title: 'Professional Internships',
    desc: 'Completed specialized developer-track training programs, including AI & ML at the National Telecommunication Institute (NTI), Business Intelligence development at Housing and Development Bank (HDB), and Data Analytics with DEPI.'
  },
  3: {
    icon: '03',
    title: 'Hackathons & Competitions',
    desc: 'Engineered an end-to-end meteorological data ingestion and prediction pipeline for the NASA Space Apps Challenge, and developed a real-time analytics streaming engine for the Orange Egypt Hackathon.'
  }
};

function initJourneyTimeline() {
  const tabs = document.querySelectorAll('.process-tab');
  const iconEl = document.getElementById('process-icon');
  const titleEl = document.getElementById('process-title-text');
  const descEl = document.getElementById('process-desc-text');

  if (!tabs.length || !iconEl) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const step = e.currentTarget.dataset.step;
      const stepData = journeyData[step];

      if (stepData) {
        // Add a smooth quick transition fade
        const contentBox = document.getElementById('journey-content');
        contentBox.style.opacity = '0.7';
        contentBox.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
          iconEl.textContent = stepData.icon;
          titleEl.textContent = stepData.title;
          descEl.textContent = stepData.desc;
          
          contentBox.style.opacity = '1';
          contentBox.style.transform = 'scale(1)';
        }, 120);
      }
    });
  });
}

/* ==========================================================================
   4. DYNAMIC PROJECTS GRID (GITHUB INTEGRATION & FALLBACKS)
   ========================================================================== */

// Hardcoded fallback data to guarantee professional content even if API is rate-limited
const fallbackProjects = {
  featured: [
    {
      name: 'Kepler-Exoplanet',
      description: 'An advanced data engineering and machine learning project modeling Kepler satellite telemetry to predict and classify potential exoplanetary candidates.',
      language: 'Jupyter Notebook',
      stargazers_count: 5,
      html_url: 'https://github.com/Mayar-hany-2005/Kepler-Exoplanet',
      techStack: ['Python', 'CatBoost', 'Prophet', 'Pandas', 'Predictive Modeling', 'Feature Store'],
      category: 'MACHINE LEARNING'
    },
    {
      name: 'WillItRain-Youthify',
      description: 'An end-to-end meteorological data processing engine built during the NASA Space Apps Challenge. Includes data extraction, historical analysis, and rain forecasting.',
      language: 'Python',
      stargazers_count: 3,
      html_url: 'https://github.com/Mayar-hany-2005/WillItRain-Youthify',
      techStack: ['Python', 'ETL Pipelines', 'Data Scraping', 'Forecasting', 'API Ingestion'],
      category: 'DATA PIPELINE'
    },
    {
      name: 'airbnb-analytics',
      description: 'A big-data pipeline analyzing Airbnb rental datasets. Cleans listings, performs spatial pricing calculations, and generates interactive maps for real-estate market research.',
      language: 'Python',
      stargazers_count: 2,
      html_url: 'https://github.com/Mayar-hany-2005/airbnb-analytics',
      techStack: ['PySpark', 'PostgreSQL', 'Docker', 'GIS Mapping', 'Data Lakes'],
      category: 'BIG DATA'
    },
    {
      name: 'E-commerce-Analytics-Dashboard',
      description: 'A transaction processing dashboard. Ingests mock retail sales records via Dagster, stores them in structured SQL schemas, and visualizes KPIs through Power BI reports.',
      language: 'SQL',
      stargazers_count: 4,
      html_url: 'https://github.com/Mayar-hany-2005/E-commerce-Analytics-Dashboard',
      techStack: ['SQL Server', 'Dagster Orchestrator', 'SSIS ETL', 'Power BI', 'Dimensional Modeling'],
      category: 'BI & ANALYTICS'
    },
    {
      name: 'Financial-Customer-Analysis',
      description: 'A financial predictive analytics system built to analyze customer transactions, predict churn risk scores, and segment profiles based on historical interactions.',
      language: 'Python',
      stargazers_count: 2,
      html_url: 'https://github.com/Mayar-hany-2005/Financial-Customer-Analysis',
      techStack: ['Scikit-Learn', 'Feature Engineering', 'PostgreSQL', 'Machine Learning'],
      category: 'DATA SCIENCE'
    }
  ]
};

const collabRepoNames = [
  'WillItRain-Youthify',
  'Financial-Customer-Analysis',
  'E-commerce-Analytics-Dashboard',
  'airbnb-analytics',
  'Kepler-Exoplanet'
];

let globalReposList = []; // Cache loaded data

function initProjects() {
  const container = document.getElementById('projects-container');
  const tabs = document.querySelectorAll('.tab-btn');
  if (!container || !tabs.length) return;

  // Handle Tab Switching
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      const source = e.currentTarget.dataset.source;
      loadProjectsSection(source);
    });
  });

  // Default load on startup
  loadProjectsSection('github-mine');
}

async function loadProjectsSection(source) {
  const container = document.getElementById('projects-container');

  // Display Skeleton shimmers during network activity
  container.innerHTML = `
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
  `;

  try {
    let username = (source === 'github-mine') ? 'Mayar-hany-2005' : 'Ahmed-Esso';
    let data = await fetchGitHubRepos(username);
    
    if (source === 'github-mine') {
      // Filter out forks and profile README / portfolio repositories
      const excludedRepoNames = ['mayar-hany-2005', 'portfolio'];
      data = data.filter(repo => !repo.fork && !excludedRepoNames.includes(repo.name.toLowerCase()));
    } else {
      // Filter collaborations by list
      data = data.filter(repo => collabRepoNames.includes(repo.name));
    }

    renderProjectsList(data);
  } catch (error) {
    console.error('Projects Ingestion Failed:', error);
    // Graceful fallback to static data if API limit is hit
    const fallbackList = source === 'github-mine' 
      ? fallbackProjects.featured.filter(p => p.html_url.includes('Mayar-hany-2005'))
      : fallbackProjects.featured;
      
    renderProjectsList(fallbackList, true);
  }
}

// Fetch helper with browser sessionStorage caching to prevent rate-limits
async function fetchGitHubRepos(username) {
  const cacheKey = `github-repos-${username}`;
  const cachedData = sessionStorage.getItem(cacheKey);
  
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  if (!response.ok) {
    throw new Error(`GitHub API returned status: ${response.status}`);
  }
  
  const repos = await response.json();
  sessionStorage.setItem(cacheKey, JSON.stringify(repos));
  return repos;
}

function renderProjectsList(repos, isFallback = false) {
  const container = document.getElementById('projects-container');
  globalReposList = repos; // Set global list for modal access

  if (!repos || !repos.length) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; border: var(--border-width) dashed var(--border-color); border-radius: var(--border-radius-md); background: var(--box-bg);">
        <h3 style="margin-bottom: 10px;">No Repositories Found</h3>
        <p>This section is currently empty on GitHub.</p>
      </div>
    `;
    return;
  }

  // Sort repos by updated date
  const sortedRepos = [...repos].sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));

  container.innerHTML = sortedRepos.map((repo, index) => {
    // Match with detailed static info to get accurate metadata and tags if present
    const metaMatch = fallbackProjects.featured.find(f => f.name.toLowerCase() === repo.name.toLowerCase()) || {};
    const description = repo.description || metaMatch.description || 'Data engineering and architectural pipeline logic.';
    const techTag = repo.language || metaMatch.language || 'Python';
    const stars = repo.stargazers_count !== undefined ? repo.stargazers_count : (metaMatch.stargazers_count || 0);
    const category = metaMatch.category || 'REPOS WORK';
    
    return `
      <div class="card" onclick="openModal(${index})">
        <div class="card-img-placeholder">
          <span>${repo.name.replace(/[-_]/g, ' ').toUpperCase()}</span>
          <span class="card-placeholder-label">${category}</span>
        </div>
        <div class="card-content">
          <h3>${repo.name.replace(/[-_]/g, ' ')}</h3>
          <p>${description}</p>
          <div class="card-footer">
            <span class="card-meta-tag">${techTag}</span>
            <span class="card-stars">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" style="color:var(--accent-yellow);"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ${stars}
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   5. PROJECT DETAILS MODAL
   ========================================================================== */

const modal = document.getElementById('project-modal');

window.openModal = function(index) {
  if (!modal) return;
  const repo = globalReposList[index];
  if (!repo) return;

  const metaMatch = fallbackProjects.featured.find(f => f.name.toLowerCase() === repo.name.toLowerCase()) || {};
  const description = repo.description || metaMatch.description || 'No detailed documentation is supplied for this codebase. Review the repository link below to inspect source schemas, data workflows, and notebooks.';
  const lang = repo.language || metaMatch.language || 'Python';
  const stars = repo.stargazers_count !== undefined ? repo.stargazers_count : (metaMatch.stargazers_count || 0);
  const category = metaMatch.category || 'DATA INFRASTRUCTURE';
  const techStack = metaMatch.techStack || [lang, 'Data Engineering', 'GitHub Workflows'];

  document.getElementById('modal-title').textContent = repo.name.replace(/[-_]/g, ' ');
  document.getElementById('modal-category').textContent = category;
  document.getElementById('modal-lang').textContent = lang;
  document.getElementById('modal-stars').innerHTML = `⭐ ${stars}`;
  document.getElementById('modal-desc').textContent = description;
  document.getElementById('modal-link').href = repo.html_url || repo.homepage || '#';
  
  // Render detailed tech tags
  const tagsContainer = document.getElementById('modal-tech-tags');
  tagsContainer.innerHTML = techStack.map(tag => `<span class="tag">${tag}</span>`).join('');
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Lock background scrolling
};

window.closeModal = function(e) {
  if (e === true || e.target === modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

/* ==========================================================================
   6. CONTACT FORM SIMULATION & CLIPBOARD TOAST
   ========================================================================== */

function initContactActions() {
  const form = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const toast = document.getElementById('toast');
  const copyButtons = document.querySelectorAll('.copy-btn');

  // Submit Handler Simulation
  if (form && successModal) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      form.reset();
    });
  }

  // Copy to Clipboard buttons
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.clipboard;
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        })
        .catch(() => {
          showToast('Failed to copy to clipboard.');
        });
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

window.closeSuccessModal = function(e) {
  const successModal = document.getElementById('success-modal');
  if (e === true || e.target === successModal) {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
  }
};
