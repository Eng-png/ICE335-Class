/* VibeSwipe is intentionally a small, local-first app.
   There are no network calls here: the catalog and all matching logic live in this file. */

const catalog = [
  { id: 'dreams', title: 'Dreams', artist: 'Fleetwood Mac', genre: 'Rock', mood: 'Wistful', bpm: 120, tags: ['melodic', 'classic', 'warm', 'driving'] },
  { id: 'breezeblocks', title: 'Breezeblocks', artist: 'alt-J', genre: 'Indie', mood: 'Restless', bpm: 116, tags: ['angular', 'textured', 'indie', 'driving'] },
  { id: 'electric-feel', title: 'Electric Feel', artist: 'MGMT', genre: 'Indie', mood: 'Playful', bpm: 103, tags: ['synthy', 'groove', 'warm', 'indie'] },
  { id: 'redbone', title: 'Redbone', artist: 'Childish Gambino', genre: 'R&B', mood: 'Smoky', bpm: 160, tags: ['groove', 'soulful', 'warm', 'textured'] },
  { id: 'team', title: 'Team', artist: 'Lorde', genre: 'Pop', mood: 'Defiant', bpm: 100, tags: ['minimal', 'moody', 'driving', 'synthy'] },
  { id: 'midnight-city', title: 'Midnight City', artist: 'M83', genre: 'Electronic', mood: 'Euphoric', bpm: 105, tags: ['synthy', 'driving', 'cinematic', 'neon'] },
  { id: 'heartbeats', title: 'Heartbeats', artist: 'The Knife', genre: 'Electronic', mood: 'Intimate', bpm: 130, tags: ['minimal', 'synthy', 'melodic', 'textured'] },
  { id: 'everybody-wants-to-rule-the-world', title: 'Everybody Wants to Rule the World', artist: 'Tears for Fears', genre: 'Pop', mood: 'Bright', bpm: 112, tags: ['classic', 'melodic', 'warm', 'groove'] },
  { id: 'paper-planes', title: 'Paper Planes', artist: 'M.I.A.', genre: 'Hip-Hop', mood: 'Defiant', bpm: 86, tags: ['minimal', 'textured', 'groove', 'angular'] },
  { id: 'such-great-heights', title: 'Such Great Heights', artist: 'The Postal Service', genre: 'Indie', mood: 'Hopeful', bpm: 111, tags: ['synthy', 'melodic', 'indie', 'bright'] },
  { id: 'seven-nation-army', title: 'Seven Nation Army', artist: 'The White Stripes', genre: 'Rock', mood: 'Defiant', bpm: 124, tags: ['classic', 'angular', 'driving', 'minimal'] },
  { id: 'the-less-i-know-the-better', title: 'The Less I Know the Better', artist: 'Tame Impala', genre: 'Psych Rock', mood: 'Dreamy', bpm: 117, tags: ['groove', 'warm', 'melodic', 'psychedelic'] }
];

// State is kept in one object so each view can be rendered from a predictable snapshot.
const state = {
  view: 'home',
  seed: null,
  recommendations: [],
  currentIndex: 0,
  saved: [],
  query: ''
};

const elements = {
  home: document.querySelector('#home-view'),
  match: document.querySelector('#match-view'),
  deck: document.querySelector('#deck-view'),
  saved: document.querySelector('#saved-view'),
  search: document.querySelector('#song-search'),
  results: document.querySelector('#search-results'),
  seedCard: document.querySelector('#seed-card'),
  recommendationCard: document.querySelector('#recommendation-card'),
  stamp: document.querySelector('#swipe-stamp'),
  current: document.querySelector('#deck-current'),
  total: document.querySelector('#deck-total'),
  progress: document.querySelector('#progress-bar'),
  savedList: document.querySelector('#saved-list'),
  emptySaved: document.querySelector('#empty-saved'),
  savedSummary: document.querySelector('#saved-summary'),
  live: document.querySelector('#live-region')
};

// Matching is deliberately explainable. Shared tags carry the most weight.
// Genre and mood are useful broad signals, while BPM proximity rewards similar pace.
function scoreMatch(seed, candidate) {
  const sharedTags = candidate.tags.filter((tag) => seed.tags.includes(tag));
  const bpmDistance = Math.abs(seed.bpm - candidate.bpm);
  const tagScore = sharedTags.length * 32;
  const genreScore = seed.genre === candidate.genre ? 14 : 0;
  const moodScore = seed.mood === candidate.mood ? 10 : 0;
  const bpmScore = Math.max(0, 24 - bpmDistance * 0.6);
  return { total: tagScore + genreScore + moodScore + bpmScore, sharedTags, bpmDistance };
}

// Sorting by score plus the catalog index makes ties deterministic on every run.
function buildRecommendations(seed) {
  return catalog
    .filter((song) => song.id !== seed.id)
    .map((song, index) => ({ song, match: scoreMatch(seed, song), index }))
    .sort((a, b) => b.match.total - a.match.total || a.index - b.index)
    .slice(0, 5);
}

function renderSongDetails(song, isSeed = false) {
  const label = isSeed ? 'Selected track' : 'Recommendation';
  return `
    <span class="card-kicker">${label}</span>
    <h3 class="card-title">${song.title}</h3>
    <p class="card-artist">${song.artist}</p>
    <div class="card-details">
      <span class="detail-chip">${song.genre}</span>
      <span class="detail-chip">${song.mood}</span>
      <span class="detail-chip">${song.bpm} BPM</span>
    </div>
  `;
}

function showView(viewName) {
  state.view = viewName;
  [elements.home, elements.match, elements.deck, elements.saved].forEach((view) => view.classList.add('is-hidden'));
  const active = { home: elements.home, match: elements.match, deck: elements.deck, saved: elements.saved }[viewName];
  active.classList.remove('is-hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function announce(message) {
  elements.live.textContent = message;
}

function selectSeed(song) {
  state.seed = song;
  state.query = song.title;
  elements.search.value = song.title;
  elements.results.innerHTML = '';
  elements.seedCard.innerHTML = renderSongDetails(song, true);
  showView('match');
  announce(`${song.title} by ${song.artist} selected.`);
}

function renderSearchResults(query) {
  const normalized = query.trim().toLowerCase();
  elements.results.innerHTML = '';
  if (!normalized) return;

  const matches = catalog.filter((song) =>
    `${song.title} ${song.artist}`.toLowerCase().includes(normalized)
  ).slice(0, 4);

  if (!matches.length) {
    elements.results.innerHTML = '<p class="no-result">No exact catalog match yet. Try a recognizable title or artist.</p>';
    return;
  }
  matches.forEach((song) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'result-item';
    button.setAttribute('role', 'option');
    button.innerHTML = `<span><strong class="result-title">${song.title}</strong><span class="result-artist">${song.artist} · ${song.genre}</span></span><span class="result-arrow" aria-hidden="true">→</span>`;
    button.addEventListener('click', () => selectSeed(song));
    elements.results.appendChild(button);
  });
}

function renderRecommendation() {
  const item = state.recommendations[state.currentIndex];
  if (!item) {
    renderSaved();
    showView('saved');
    return;
  }
  const { song, match } = item;
  elements.recommendationCard.className = 'recommendation-card';
  elements.recommendationCard.innerHTML = renderSongDetails(song);
  const sharedText = match.sharedTags.length > 1
    ? `${match.sharedTags.slice(0, 2).join(' and ')} textures`
    : `${match.sharedTags[0] || song.genre.toLowerCase()} character`;
  const paceText = match.bpmDistance === 0
    ? 'the same pulse'
    : `a nearby ${song.bpm} BPM pulse`;
  const genreText = song.genre === state.seed.genre ? ` Both sit in ${song.genre.toLowerCase()}.` : '';
  elements.recommendationCard.insertAdjacentHTML('beforeend', `
    <div class="why-box">
      <span class="why-label">Why this matches</span>
      <p class="why-text">Shares ${sharedText} with “${state.seed.title}” and keeps ${paceText}.${genreText}</p>
    </div>
  `);
  elements.current.textContent = String(state.currentIndex + 1).padStart(2, '0');
  elements.total.textContent = String(state.recommendations.length).padStart(2, '0');
  elements.progress.style.width = `${(state.currentIndex / state.recommendations.length) * 100}%`;
  elements.recommendationCard.focus({ preventScroll: true });
}

function renderSaved() {
  elements.savedList.innerHTML = '';
  elements.emptySaved.classList.toggle('is-hidden', state.saved.length > 0);
  elements.savedSummary.textContent = state.saved.length
    ? `${state.saved.length} of ${state.recommendations.length} tracks made the cut from your ${state.seed.title} starting point.`
    : `Nothing saved from this stack. Your taste is allowed to be selective.`;
  state.saved.forEach((song, index) => {
    const item = document.createElement('article');
    item.className = 'saved-item';
    item.innerHTML = `
      <span class="saved-number">${String(index + 1).padStart(2, '0')} / saved</span>
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
      <div class="saved-meta"><span>${song.genre}</span><span>${song.mood}</span><span>${song.bpm} BPM</span></div>
    `;
    elements.savedList.appendChild(item);
  });
}

function beginDiscovery() {
  if (!state.seed) return;
  state.recommendations = buildRecommendations(state.seed);
  state.currentIndex = 0;
  state.saved = [];
  showView('deck');
  renderRecommendation();
  announce(`Five recommendations built from ${state.seed.title}.`);
}

function finishSwipe(decision) {
  const item = state.recommendations[state.currentIndex];
  if (!item) return;
  const { song } = item;
  if (decision === 'save') state.saved.push(song);
  elements.stamp.textContent = decision === 'save' ? 'Saved' : 'Skipped';
  elements.stamp.className = `swipe-stamp show-${decision}`;
  elements.recommendationCard.classList.add(decision === 'save' ? 'card-exit-right' : 'card-exit-left');
  announce(`${song.title} ${decision === 'save' ? 'saved' : 'skipped'}.`);
  window.setTimeout(() => {
    state.currentIndex += 1;
    elements.stamp.className = 'swipe-stamp';
    if (state.currentIndex >= state.recommendations.length) {
      renderSaved();
      showView('saved');
      announce(`Stack complete. ${state.saved.length} songs saved.`);
    } else {
      renderRecommendation();
    }
  }, 300);
}

function resetApp() {
  state.view = 'home';
  state.seed = null;
  state.recommendations = [];
  state.currentIndex = 0;
  state.saved = [];
  state.query = '';
  elements.search.value = '';
  elements.results.innerHTML = '';
  showView('home');
  elements.search.focus({ preventScroll: true });
  announce('Back at the song search.');
}

// Search input updates the local result list as the listener types.
elements.search.addEventListener('input', (event) => {
  state.query = event.target.value;
  renderSearchResults(state.query);
});

// Enter selects the first visible catalog result, keeping keyboard search quick.
document.querySelector('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const firstMatch = catalog.find((song) =>
    `${song.title} ${song.artist}`.toLowerCase().includes(state.query.trim().toLowerCase())
  );
  if (firstMatch && state.query.trim()) selectSeed(firstMatch);
  else renderSearchResults(state.query);
});

// Delegated click handling keeps the small number of global controls easy to scan.
document.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  const action = actionButton.dataset.action;
  if (action === 'reset') resetApp();
  if (action === 'back-home') showView('home');
  if (action === 'begin') beginDiscovery();
  if (action === 'skip' || action === 'save') finishSwipe(action);
});

// Arrow keys are the same actions as the visible swipe controls.
document.addEventListener('keydown', (event) => {
  if (state.view !== 'deck' || event.target.matches('input, textarea, button')) return;
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    finishSwipe('skip');
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    finishSwipe('save');
  }
});

// A light pointer gesture supports touch screens without hiding the button controls.
let pointerStartX = null;
elements.recommendationCard.addEventListener('pointerdown', (event) => {
  if (state.view !== 'deck') return;
  pointerStartX = event.clientX;
  elements.recommendationCard.setPointerCapture(event.pointerId);
});
elements.recommendationCard.addEventListener('pointerup', (event) => {
  if (pointerStartX === null) return;
  const distance = event.clientX - pointerStartX;
  pointerStartX = null;
  if (Math.abs(distance) > 80) finishSwipe(distance > 0 ? 'save' : 'skip');
});
