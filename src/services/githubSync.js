import { projectsData } from '../data/projects.js';

const GITHUB_USERNAME = 'samir-60';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;
const CACHE_KEY = 'samir_github_repos_cache_v2';
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes cache TTL

/**
 * Maps programming languages to aesthetic accent colors
 */
const LANGUAGE_COLORS = {
  TypeScript: '#38bdf8',
  JavaScript: '#fbbf24',
  Python: '#3b82f6',
  HTML: '#f97316',
  CSS: '#a855f7',
  'C++': '#ec4899',
  C: '#64748b',
  Go: '#06b6d4',
  Rust: '#ef4444',
  Dart: '#10b981'
};

/**
 * Resolves authentic project UI mockups for repositories based on their domain and name
 */
function getRepoCoverImage(repoName, language) {
  const clean = (repoName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (clean.includes('softyx') && clean.includes('fraud')) return './assets/projects/fraud_ui.jpg';
  if (clean.includes('softyx')) return './assets/projects/softyx_ui.jpg';
  if (clean.includes('profix') || clean.includes('shine')) return './assets/projects/profix_ui.jpg';
  if (clean.includes('biblio') || clean.includes('book')) return './assets/projects/bibliodrop_ui.jpg';
  if (clean.includes('study') || clean.includes('sync')) return './assets/projects/studysync_ui.jpg';
  if (clean.includes('fraud') || clean.includes('cyber') || clean.includes('security')) return './assets/projects/fraud_ui.jpg';
  if (clean.includes('protfolio') || clean.includes('portfolio') || clean.includes('samir')) return './assets/projects/portfolio_ui.jpg';
  
  if (language === 'Python') return './assets/projects/fraud_ui.jpg';
  if (language === 'JavaScript' || language === 'HTML') return './assets/projects/studysync_ui.jpg';
  return './assets/projects/portfolio_ui.jpg';
}

/**
 * Automatically fetches and syncs public GitHub repositories from samir-60
 */
export async function syncGitHubRepositories(onSyncComplete) {
  // 1. First, check localStorage cache for immediate instant rendering
  const cached = getValidCache();
  if (cached && cached.length > 0) {
    if (onSyncComplete) onSyncComplete(cached, true);
  }

  // 2. Fetch fresh live data from GitHub API in background
  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      console.warn(`GitHub API returned status ${response.status}. Using fallback project list.`);
      if (!cached && onSyncComplete) onSyncComplete(projectsData, false);
      return;
    }

    const githubRepos = await response.json();
    if (!Array.isArray(githubRepos)) return;

    // 3. Merge live GitHub repos with curated projects
    const mergedProjects = mergeReposWithProjects(githubRepos, projectsData);

    // 4. Save to cache
    saveCache(mergedProjects);

    // 5. Trigger update callback
    if (onSyncComplete) {
      onSyncComplete(mergedProjects, false);
    }
  } catch (error) {
    console.warn('Live GitHub auto-sync network error, using fallback:', error);
    if (!cached && onSyncComplete) {
      onSyncComplete(projectsData, false);
    }
  }
}

/**
 * Merges GitHub API repository objects into our structured project array
 */
function mergeReposWithProjects(githubRepos, curatedProjects) {
  const merged = [...curatedProjects];
  const existingGithubUrls = new Set(curatedProjects.map(p => p.githubUrl?.toLowerCase()).filter(Boolean));
  const existingNames = new Set(curatedProjects.map(p => p.id?.toLowerCase().replace(/[^a-z0-9]/g, '')));

  // Filter out forks if preferred, or include all public repos
  const nonForkRepos = githubRepos.filter(r => !r.fork || r.stargazers_count > 0);

  nonForkRepos.forEach(repo => {
    const repoUrl = repo.html_url.toLowerCase();
    const cleanRepoName = repo.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Check if repo is already in curated projects
    const existingIndex = merged.findIndex(p => 
      (p.githubUrl && p.githubUrl.toLowerCase() === repoUrl) ||
      (p.id && p.id.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanRepoName)
    );

    if (existingIndex !== -1) {
      // Update live stats on existing curated project
      merged[existingIndex] = {
        ...merged[existingIndex],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.pushed_at || repo.updated_at,
        githubUrl: repo.html_url,
        liveUrl: merged[existingIndex].liveUrl || repo.homepage || repo.html_url
      };
    } else {
      // BRAND NEW REPO: Automatically create a new project card!
      const newProject = createProjectFromRepo(repo);
      merged.push(newProject);
    }
  });

  return merged;
}

/**
 * Generates a full project object from a raw GitHub repository API object
 */
function createProjectFromRepo(repo) {
  const language = repo.language || 'TypeScript';
  const color = LANGUAGE_COLORS[language] || '#38bdf8';
  const image = getRepoCoverImage(repo.name, language);
  
  // Format readable title: "study-sync" -> "Study Sync"
  const formattedTitle = repo.name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  // Determine category based on topics, language, and name keywords
  let category = 'fullstack';
  const nameLower = repo.name.toLowerCase();
  const descLower = (repo.description || '').toLowerCase();
  const topics = repo.topics || [];

  if (
    topics.includes('ai') || 
    topics.includes('machine-learning') || 
    nameLower.includes('ai') || 
    nameLower.includes('research') ||
    language === 'Python'
  ) {
    category = 'ai';
  } else if (
    topics.includes('security') || 
    topics.includes('cybersecurity') || 
    topics.includes('tool') || 
    topics.includes('cli') || 
    nameLower.includes('fraud') ||
    nameLower.includes('checker') ||
    nameLower.includes('tool')
  ) {
    category = 'tools';
  }

  // Tags
  const tags = [
    language,
    ...topics.slice(0, 3).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
    'GitHub Live'
  ];

  return {
    id: repo.name.toLowerCase(),
    title: `${formattedTitle} — GitHub Live Repo`,
    category: category,
    subtitle: repo.description || `Open-source engineering repository built by Samir Qureshi`,
    featured: false,
    badge: 'Live GitHub Repo',
    shortDescription: repo.description || `Active open-source repository published on GitHub. Built with ${language} and maintained by Samir.`,
    fullDescription: `${repo.description || 'Open-source software project by Samir Qureshi.'}\n\nThis project is automatically synchronized in real-time from GitHub repository @samir-60/${repo.name}.`,
    image: image,
    tags: tags.slice(0, 4),
    stats: {
      stars: `${repo.stargazers_count} Stars`,
      language: language,
      updated: formatRelativeTime(repo.pushed_at || repo.updated_at)
    },
    highlights: [
      `Auto-synced repository from https://github.com/samir-60/${repo.name}`,
      `Primary Architecture: ${language}`,
      `Live GitHub Stars: ${repo.stargazers_count} • Forks: ${repo.forks_count}`,
      `Last commit activity: ${new Date(repo.pushed_at || repo.updated_at).toLocaleDateString()}`
    ],
    githubUrl: repo.html_url,
    liveUrl: repo.homepage || repo.html_url,
    color: color,
    isAutoSynced: true
  };
}

/**
 * Formats relative timestamp
 */
function formatRelativeTime(dateString) {
  if (!dateString) return 'Active';
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Updated today';
  if (days === 1) return 'Updated yesterday';
  if (days < 30) return `Updated ${days}d ago`;
  const months = Math.floor(days / 30);
  return `Updated ${months}mo ago`;
}

function getValidCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      return parsed.data;
    }
  } catch (e) {
    return null;
  }
  return null;
}

function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: data
    }));
  } catch (e) {
    // Ignore storage quota errors
  }
}
