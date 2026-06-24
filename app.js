/* ==========================================================================
   Aero Life Planner Application Logic
   ========================================================================== */

// 1. Default Spotify Playlist URL
const DEFAULT_SPOTIFY_URL = 'https://open.spotify.com/playlist/37i9dQZF1DX8Ueb1mUJLmE';

// Curated Presets List (expanded dynamically for iTunes Search)
const MUSIC_PRESETS = [
  { name: "Lofi", spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX8Ueb1mUJLmE", desc: "Chill Lofi study beats" },
  { name: "Bollywood Lofi", spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX6gPCOjL5K4v", desc: "Indian Bollywood Lofi remixes" },
  { name: "Jazz", spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX0SMddj4H1zY", desc: "Coffee shop background jazz" },
  { name: "Focus", spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0EXPn", desc: "Focus and ambient soundscapes" },
  { name: "Acoustic", spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO", desc: "Relaxing acoustic songs" },
  { name: "Synthwave", spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DXdLTE7yFWUcr", desc: "Synthwave beats for productivity" }
];

// Global HTML5 Audio Player Object
const audioPlayer = new Audio();

// Default Mock Data
const DEFAULT_TASKS = [];
const DEFAULT_HABITS = [];
const DEFAULT_SHOPPING = [];
const DEFAULT_FINANCES = [];

// Helper to get offset date
function getFormattedDateOffset(daysOffset) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

// 2. Application State Object
let state = {
  username: '',
  tasks: [],
  habits: [],
  shoppingItems: [],
  finances: [],
  mealPlanner: { snack: '', breakfast: '', lunch: '' },
  activeFilter: 'all', // 'all', 'journal', 'habits', 'workout', 'meal', 'medications', 'income'
  searchQuery: '',
  sortBy: 'createdAt',
  selectedTaskId: null,
  theme: 'dark',
  spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX8Ueb1mUJLmE',
  spotifyFavorites: [],
  spotifyQueueType: 'presets',  // 'presets', 'favorites', 'search'
  spotifyQueueIndex: 0,
  spotifyNowPlaying: 'Lofi Focus',
  
  // Custom Music Player State
  musicQueue: [],
  musicQueueIndex: 0,
  musicIsPlaying: false,
  musicSearchCache: {},
  recentSearches: [],
  activePlayerType: 'spotify'
};

// Calendar control variables
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

// Audio object state removed (Spotify iframe embedded instead)

// DOM Cache
const DOM = {
  themeToggle: document.getElementById('theme-toggle'),
  todosTableBody: document.getElementById('todos-table-body'),
  selectAllTasks: document.getElementById('select-all-tasks'),
  
  // Inline Task Inputs
  inlineAddInput: document.getElementById('inline-add-input'),
  inlineCategorySelect: document.getElementById('inline-category-select'),
  inlinePrioritySelect: document.getElementById('inline-priority-select'),
  inlineDatePicker: document.getElementById('inline-date-picker'),
  inlineAddBtn: document.getElementById('inline-add-btn'),

  // Filter & Search Controls
  searchInput: document.getElementById('search-input'),
  sortSelect: document.getElementById('sort-select'),
  tabBtns: document.querySelectorAll('.tab-btn'),

  // Category navigation covers
  categoryCards: document.querySelectorAll('.category-card'),
  cardLinkBtns: document.querySelectorAll('.card-link-btn'),

  // Music Player
  musicPlayerCard: document.getElementById('music-player-card'),
  playerAlbumArt: document.getElementById('player-album-art'),
  vinylRecord: document.getElementById('vinyl-record'),
  playerTrackTitle: document.getElementById('player-track-title'),
  playerTrackArtist: document.getElementById('player-track-artist'),
  playerFavBtn: document.getElementById('player-fav-btn'),
  playerTimeCurrent: document.getElementById('player-time-current'),
  playerProgressBarBg: document.getElementById('player-progress-bar-bg'),
  playerProgressFill: document.getElementById('player-progress-fill'),
  playerTimeTotal: document.getElementById('player-time-total'),
  playerPrevBtn: document.getElementById('player-prev-btn'),
  playerPlayBtn: document.getElementById('player-play-btn'),
  playSvg: document.getElementById('play-svg'),
  pauseSvg: document.getElementById('pause-svg'),
  spinnerSvg: document.getElementById('spinner-svg'),
  playerNextBtn: document.getElementById('player-next-btn'),
  playerVolumeSlider: document.getElementById('player-volume-slider'),
  
  spotifyIframeWrapper: document.getElementById('spotify-iframe-wrapper'),
  
  musicSearchInput: document.getElementById('music-search-input'),
  searchSpinner: document.getElementById('search-spinner'),
  searchSuggestions: document.getElementById('search-suggestions'),
  spotifySearchShortcutGroup: document.getElementById('spotify-search-shortcut-group'),
  spotifySearchShortcutBtn: document.getElementById('spotify-search-shortcut-btn'),
  spotifySearchQueryText: document.getElementById('spotify-search-query-text'),
  recentSearchesGroup: document.getElementById('recent-searches-group'),
  recentSearchesList: document.getElementById('recent-searches-list'),
  searchResultsContainer: document.getElementById('search-results-container'),
  searchResultsList: document.getElementById('search-results-list'),
  
  spotifyPresetsContainer: document.getElementById('spotify-presets-container'),
  spotifyFavsList: document.getElementById('spotify-favs-list'),

  // Calendar
  calendarMonthYear: document.getElementById('calendar-month-year'),
  calendarDaysGrid: document.getElementById('calendar-days-grid'),
  calPrevBtn: document.getElementById('cal-prev-btn'),
  calTodayBtn: document.getElementById('cal-today-btn'),
  calNextBtn: document.getElementById('cal-next-btn'),

  // Upcoming
  upcomingTodayList: document.getElementById('upcoming-today-list'),
  upcomingTomorrowList: document.getElementById('upcoming-tomorrow-list'),
  upcomingWeekList: document.getElementById('upcoming-week-list'),

  // Habits
  habitsProgressPct: document.getElementById('habits-progress-pct'),
  habitsProgressFill: document.getElementById('habits-progress-fill'),
  habitsChecklist: document.getElementById('habits-checklist'),
  addHabitInput: document.getElementById('add-habit-input'),
  addHabitBtn: document.getElementById('add-habit-btn'),

  // Meals
  mealSnackInput: document.getElementById('meal-snack-input'),
  mealBreakfastInput: document.getElementById('meal-breakfast-input'),
  mealLunchInput: document.getElementById('meal-lunch-input'),

  // Shopping List
  shoppingChecklist: document.getElementById('shopping-checklist'),
  addShoppingInput: document.getElementById('add-shopping-input'),
  addShoppingBtn: document.getElementById('add-shopping-btn'),

  // Finance
  finIncome: document.getElementById('fin-income'),
  finExpense: document.getElementById('fin-expense'),
  finBalance: document.getElementById('fin-balance'),
  financeLogsList: document.getElementById('finance-logs-list'),
  finDescInput: document.getElementById('fin-desc-input'),
  finAmountInput: document.getElementById('fin-amount-input'),
  finTypeSelect: document.getElementById('fin-type-select'),
  finAddBtn: document.getElementById('fin-add-btn'),

  // Backup & Footer Actions
  clearAllBtn: document.getElementById('clear-all-btn'),

  // Details drawer
  detailsOverlay: document.getElementById('details-overlay'),
  detailsPanel: document.getElementById('details-panel'),
  closeDetailsBtn: document.getElementById('close-details-btn'),
  detailTitleInput: document.getElementById('detail-title-input'),
  detailDescInput: document.getElementById('detail-desc-input'),
  detailPrioritySelect: document.getElementById('detail-priority-select'),
  detailCategorySelect: document.getElementById('detail-category-select'),
  detailDatePicker: document.getElementById('detail-date-picker'),
  subtasksRatio: document.getElementById('subtasks-ratio'),
  subtaskProgressFill: document.getElementById('subtask-progress-fill'),
  subtasksList: document.getElementById('subtasks-list'),
  newSubtaskInput: document.getElementById('new-subtask-input'),
  addSubtaskBtn: document.getElementById('add-subtask-btn'),
  deleteTaskBtn: document.getElementById('delete-task-btn'),

  // Confirm Modal
  confirmModal: document.getElementById('confirm-modal'),
  confirmModalText: document.getElementById('confirm-modal-text'),
  cancelConfirmBtn: document.getElementById('cancel-confirm-btn'),
  confirmActionBtn: document.getElementById('confirm-action-btn'),

  // Toast
  toast: document.getElementById('toast'),
  toastMessage: document.getElementById('toast-message'),

  // Sign In & Personalization elements
  signinModal: document.getElementById('signin-modal'),
  signinEmailInput: document.getElementById('signin-email-input'),
  signinBtn: document.getElementById('signin-btn'),
  googleSigninBtn: document.getElementById('google-signin-btn'),
  signinCounter: document.getElementById('signin-counter'),
  footerCounter: document.getElementById('footer-counter'),
  visitorCounter: document.getElementById('visitor-counter'),
  profileBtn: document.getElementById('profile-btn'),
  heroTitle: document.getElementById('hero-title'),
  boardTitle: document.getElementById('board-title'),
  inlineTimePicker: document.getElementById('inline-time-picker'),
  detailTimePicker: document.getElementById('detail-time-picker')
};

let confirmationCallback = null;

// ==========================================================================
// 3. Application Start & Lifecycle
// ==========================================================================
function init() {
  loadData();
  setupSpotifyWidget();
  setupEventListeners();
  renderApp();
  checkSignin();
  syncUserCounter();
}

function loadData() {
  const storedTasks = localStorage.getItem('lifeplanner_v2_tasks');
  const storedHabits = localStorage.getItem('lifeplanner_v2_habits');
  const storedShopping = localStorage.getItem('lifeplanner_v2_shopping');
  const storedFinances = localStorage.getItem('lifeplanner_v2_finances');
  const storedMeals = localStorage.getItem('lifeplanner_v2_meals');
  const storedTheme = localStorage.getItem('lifeplanner_v2_theme');
  const storedSpotifyUrl = localStorage.getItem('lifeplanner_v2_spotify_url');
  const storedSpotifyFavs = localStorage.getItem('lifeplanner_v2_spotify_favs');
  const storedSpotifyQueueType = localStorage.getItem('lifeplanner_v2_spotify_q_type');
  const storedSpotifyQueueIndex = localStorage.getItem('lifeplanner_v2_spotify_q_index');
  const storedSpotifyNowPlaying = localStorage.getItem('lifeplanner_v2_spotify_now_playing');
  const storedRecentSearches = localStorage.getItem('lifeplanner_v2_recent_searches');
  const storedActivePlayerType = localStorage.getItem('lifeplanner_v2_active_player_type');
  const storedUsername = localStorage.getItem('lifeplanner_username');

  state.tasks = storedTasks ? JSON.parse(storedTasks) : [...DEFAULT_TASKS];
  state.habits = storedHabits ? JSON.parse(storedHabits) : [...DEFAULT_HABITS];
  state.shoppingItems = storedShopping ? JSON.parse(storedShopping) : [...DEFAULT_SHOPPING];
  state.finances = storedFinances ? JSON.parse(storedFinances) : [...DEFAULT_FINANCES];
  state.mealPlanner = storedMeals ? JSON.parse(storedMeals) : { snack: '', breakfast: '', lunch: '' };
  
  state.theme = storedTheme || 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);

  state.spotifyUrl = storedSpotifyUrl || DEFAULT_SPOTIFY_URL;
  state.spotifyFavorites = storedSpotifyFavs ? JSON.parse(storedSpotifyFavs) : [];
  state.spotifyQueueType = storedSpotifyQueueType || 'presets';
  state.spotifyQueueIndex = storedSpotifyQueueIndex !== null ? parseInt(storedSpotifyQueueIndex, 10) : 0;
  state.spotifyNowPlaying = storedSpotifyNowPlaying || 'Lofi';
  state.recentSearches = storedRecentSearches ? JSON.parse(storedRecentSearches) : [];
  state.activePlayerType = storedActivePlayerType || 'spotify';
  state.username = storedUsername || '';
}

function saveData() {
  localStorage.setItem('lifeplanner_v2_tasks', JSON.stringify(state.tasks));
  localStorage.setItem('lifeplanner_v2_habits', JSON.stringify(state.habits));
  localStorage.setItem('lifeplanner_v2_shopping', JSON.stringify(state.shoppingItems));
  localStorage.setItem('lifeplanner_v2_finances', JSON.stringify(state.finances));
  localStorage.setItem('lifeplanner_v2_meals', JSON.stringify(state.mealPlanner));
  localStorage.setItem('lifeplanner_v2_theme', state.theme);
  localStorage.setItem('lifeplanner_v2_spotify_url', state.spotifyUrl);
  localStorage.setItem('lifeplanner_v2_spotify_favs', JSON.stringify(state.spotifyFavorites));
  localStorage.setItem('lifeplanner_v2_spotify_q_type', state.spotifyQueueType);
  localStorage.setItem('lifeplanner_v2_spotify_q_index', state.spotifyQueueIndex);
  localStorage.setItem('lifeplanner_v2_spotify_now_playing', state.spotifyNowPlaying);
  localStorage.setItem('lifeplanner_v2_recent_searches', JSON.stringify(state.recentSearches));
  localStorage.setItem('lifeplanner_v2_active_player_type', state.activePlayerType);
  localStorage.setItem('lifeplanner_username', state.username);
}

// Simulate registered users database
function getRegisteredUsers() {
  const stored = localStorage.getItem('lifeplanner_registered_users');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

function registerUser(username) {
  if (!username) return false;
  const normalized = username.trim().toLowerCase();
  if (!normalized) return false;
  
  const users = getRegisteredUsers();
  if (!users.includes(normalized)) {
    users.push(normalized);
    localStorage.setItem('lifeplanner_registered_users', JSON.stringify(users));
    syncUserCounter();
    return true; // Newly registered
  }
  return false; // Already exists (login/refresh/etc)
}

function syncUserCounter() {
  const users = getRegisteredUsers();
  const count = users.length;
  
  if (DOM.visitorCounter) {
    DOM.visitorCounter.textContent = count;
    DOM.visitorCounter.classList.add('counter-pop-animation');
    setTimeout(() => {
      DOM.visitorCounter.classList.remove('counter-pop-animation');
    }, 300);
  }
  
  const labelEl = document.querySelector('.nav-counter-lbl');
  if (labelEl) {
    labelEl.textContent = count === 1 ? 'User Joined' : 'Users Joined';
  }
  
  if (DOM.signinCounter) {
    DOM.signinCounter.textContent = count.toLocaleString();
  }
  
  if (DOM.footerCounter) {
    DOM.footerCounter.textContent = count.toLocaleString();
  }
}



// Sign-In Personalization Controllers
function checkSignin() {
  if (!state.username) {
    if (DOM.signinModal) DOM.signinModal.classList.add('show');
    if (DOM.signinEmailInput) DOM.signinEmailInput.focus();
  } else {
    personalizeDashboard();
    // Brief delay before welcome popup to let page animations settle
    setTimeout(() => {
      showPersonalizedWelcome();
    }, 800);
  }
}

function personalizeDashboard() {
  if (state.username) {
    const normName = state.username.toLowerCase();
    if (normName.includes('srishti')) {
      if (DOM.heroTitle) DOM.heroTitle.textContent = "Master Your Day, Every Day";
      const sub = document.getElementById('hero-subtitle');
      if (sub) sub.textContent = "Organize tasks, track goals, and stay productive with a planner designed for modern life.";
      if (DOM.boardTitle) DOM.boardTitle.textContent = "LIFE PLANNER";
    } else {
      if (DOM.heroTitle) DOM.heroTitle.textContent = `Welcome back, ${state.username}.`;
      const sub = document.getElementById('hero-subtitle');
      if (sub) sub.textContent = "";
      if (DOM.boardTitle) DOM.boardTitle.textContent = `${state.username}'s Life Planner`;
    }
  }
}

function showPersonalizedWelcome() {
  const todayStr = getFormattedDateOffset(0);
  const todayTasks = state.tasks.filter(t => !t.completed && t.dueDate === todayStr);
  const taskCount = todayTasks.length;
  
  let welcomeMsg = `Welcome back, ${state.username}! ✨`;
  if (taskCount > 0) {
    welcomeMsg += ` You have ${taskCount} task${taskCount > 1 ? 's' : ''} due today. Let's get started! ☀️`;
  } else {
    welcomeMsg += ` Your schedule is clear for today. Have a productive day! ☕`;
  }
  showToast(welcomeMsg);
}

function extractUsernameFromEmail(email) {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length < 1) return '';
  const prefix = parts[0];
  return prefix.split(/[\._-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function handleSignin() {
  const email = DOM.signinEmailInput.value.trim().toLowerCase();
  if (!email) {
    showToast("Please enter your Gmail address to sign in.");
    return;
  }
  if (!email.endsWith('@gmail.com')) {
    showToast("Please enter a valid Gmail address (e.g. aditya@gmail.com).");
    return;
  }
  registerUser(email);
  state.username = extractUsernameFromEmail(email);
  
  saveData();
  personalizeDashboard();
  
  if (DOM.signinModal) DOM.signinModal.classList.remove('show');
  
  setTimeout(() => {
    showPersonalizedWelcome();
  }, 500);
}

function handleGoogleSignin() {
  const width = 500;
  const height = 600;
  const left = (window.screen.width / 2) - (width / 2);
  const top = (window.screen.height / 2) - (height / 2);
  
  window.open(
    'signin.html', 
    'google_signin', 
    `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
  );
}

function handleSignout() {
  triggerConfirmModal("Sign out of your workspace?", () => {
    localStorage.removeItem('lifeplanner_username');
    window.location.reload();
  });
}

// ==========================================================================
// 4. Main Render Pipeline
// ==========================================================================
function renderApp() {
  renderTodosTable();
  renderCalendar();
  renderUpcomingSchedule();
  renderHabitsTracker();
  renderMealInputs();
  renderShoppingList();
  renderFinanceTracker();
  saveData();
}

// 4a. Render Overview Todos Table
function renderTodosTable() {
  DOM.todosTableBody.innerHTML = '';
  
  // Filter Tasks
  let filtered = state.tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                          (t.description && t.description.toLowerCase().includes(state.searchQuery.toLowerCase()));
    
    let matchesTab = true;
    if (state.activeFilter !== 'all') {
      // Map tabs (journal, habits, workout, meal, medications, income)
      // to task category list matches or tag queries
      matchesTab = t.category.toLowerCase() === state.activeFilter.toLowerCase() ||
                   t.title.toLowerCase().includes(state.activeFilter.toLowerCase());
    }

    return matchesSearch && matchesTab;
  });

  // Sort Tasks
  filtered.sort((a, b) => {
    if (state.sortBy === 'createdAt') return b.createdAt - a.createdAt;
    if (state.sortBy === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (state.sortBy === 'priority') {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    if (state.sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  if (filtered.length === 0) {
    DOM.todosTableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color: var(--text-muted); padding: 24px;">No planner entries found in this list.</td></tr>`;
    return;
  }

  filtered.forEach(task => {
    const tr = document.createElement('tr');
    tr.className = task.completed ? 'row-completed' : '';

    // Date indicators
    let dateHTML = '—';
    let dateClass = '';
    if (task.dueDate) {
      const diff = getDaysDifference(task.dueDate);
      if (diff < 0 && !task.completed) {
        dateClass = 'overdue-date';
        dateHTML = `Overdue (${Math.abs(diff)}d)`;
      } else if (diff === 0 && !task.completed) {
        dateClass = 'today-date';
        dateHTML = 'Today';
      } else {
        const dateObj = new Date(task.dueDate + 'T00:00:00');
        dateHTML = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }
    }

    // Colors mapping
    const categoryColors = {
      work: { bg: 'rgba(99,102,241,0.12)', fg: '#8b5cf6' },
      personal: { bg: 'rgba(236,72,153,0.12)', fg: '#ec4899' },
      shopping: { bg: 'rgba(245,158,11,0.12)', fg: '#f59e0b' },
      health: { bg: 'rgba(16,185,129,0.12)', fg: '#10b981' }
    };
    const color = categoryColors[task.category] || { bg: 'rgba(255,255,255,0.06)', fg: 'var(--text-muted)' };

    tr.innerHTML = `
      <td class="col-check">
        <input type="checkbox" class="table-task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Toggle Complete">
      </td>
      <td class="col-name table-row-name-text">${escapeHTML(task.title)}</td>
      <td class="col-category">
        <span class="badge-cat" style="background: ${color.bg}; color: ${color.fg};">${escapeHTML(task.category)}</span>
      </td>
      <td class="col-date ${dateClass}">${dateHTML}</td>
      <td class="col-priority">
        <span class="badge-priority ${task.priority}">${task.priority}</span>
      </td>
      <td class="col-actions">
        <button class="icon-btn-small table-delete-btn" title="Delete Task">
          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="1.5" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;

    // Triggers
    tr.querySelector('.table-task-checkbox').addEventListener('change', () => {
      toggleTask(task.id);
    });

    tr.querySelector('.table-row-name-text').addEventListener('click', () => {
      openDetailsPanel(task.id);
    });

    tr.querySelector('.table-delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      triggerConfirmModal('Delete this task permanently?', () => {
        deleteTask(task.id);
      });
    });

    DOM.todosTableBody.appendChild(tr);
  });
}

// 4b. Render Monthly Calendar Grid
function renderCalendar() {
  DOM.calendarDaysGrid.innerHTML = '';
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  DOM.calendarMonthYear.textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;

  // Calendar logic
  const firstDayIndex = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
  // Adjust day index for Mon-Sun week representation
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1; 

  const totalDays = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
  const prevMonthTotalDays = new Date(currentCalendarYear, currentCalendarMonth, 0).getDate();

  const today = new Date();
  const todayDateStr = today.toISOString().split('T')[0];

  // 1. Render previous month cells (padding prefix)
  for (let i = startOffset - 1; i >= 0; i--) {
    const dayNum = prevMonthTotalDays - i;
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell other-month';
    cell.innerHTML = `<span class="calendar-day-number">${dayNum}</span>`;
    DOM.calendarDaysGrid.appendChild(cell);
  }

  // 2. Render actual current month cells
  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement('div');
    const dayString = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    let isToday = dayString === todayDateStr;
    cell.className = `calendar-day-cell ${isToday ? 'today-cell' : ''}`;
    
    cell.innerHTML = `
      <div class="calendar-day-header">
        <span class="calendar-day-number">${day}</span>
        <button class="cal-day-add-btn" title="Add task for this day" data-date="${dayString}">
          <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      <div class="calendar-events-container"></div>
    `;

    // Render event tags inside day cell
    const eventsContainer = cell.querySelector('.calendar-events-container');
    const dayTasks = state.tasks.filter(t => t.dueDate === dayString);

    dayTasks.forEach(task => {
      const tag = document.createElement('div');
      tag.className = `calendar-event-tag priority-${task.priority} ${task.completed ? 'task-done' : ''}`;
      tag.textContent = task.title;
      tag.title = task.title;
      tag.addEventListener('click', (e) => {
        e.stopPropagation();
        openDetailsPanel(task.id);
      });
      eventsContainer.appendChild(tag);
    });

    // Calendar cell click event: sets inline due date helper instantly!
    cell.addEventListener('click', () => {
      DOM.inlineDatePicker.value = dayString;
      DOM.inlineAddInput.focus();
      showToast(`Selected date: ${dayString}`);
      
      // Visual feedback
      document.querySelectorAll('.calendar-day-cell').forEach(c => c.classList.remove('selected-day'));
      cell.classList.add('selected-day');
    });

    // Plus shortcut click handler
    cell.querySelector('.cal-day-add-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      DOM.inlineDatePicker.value = dayString;
      DOM.inlineAddInput.focus();
      showToast(`Adding task for: ${dayString}`);
      
      // Visual feedback
      document.querySelectorAll('.calendar-day-cell').forEach(c => c.classList.remove('selected-day'));
      cell.classList.add('selected-day');
    });

    DOM.calendarDaysGrid.appendChild(cell);
  }

  // 3. Render next month padding suffix (to fill the grid to multiples of 7)
  const totalRendered = startOffset + totalDays;
  const suffixDays = totalRendered % 7 === 0 ? 0 : 7 - (totalRendered % 7);
  for (let day = 1; day <= suffixDays; day++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell other-month';
    cell.innerHTML = `<span class="calendar-day-number">${day}</span>`;
    DOM.calendarDaysGrid.appendChild(cell);
  }
}

// 4c. Render Upcoming Timeline
function renderUpcomingSchedule() {
  DOM.upcomingTodayList.innerHTML = '';
  DOM.upcomingTomorrowList.innerHTML = '';
  DOM.upcomingWeekList.innerHTML = '';

  const todayStr = getFormattedDateOffset(0);
  const tomorrowStr = getFormattedDateOffset(1);
  
  const activeTasks = state.tasks.filter(t => !t.completed && t.dueDate);

  activeTasks.forEach(task => {
    const diff = getDaysDifference(task.dueDate);
    const item = document.createElement('div');
    item.className = `upcoming-item priority-${task.priority}`;
    
    // Date string formatting
    const dateObj = new Date(task.dueDate + 'T00:00:00');
    const dayLabel = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    item.innerHTML = `
      <span class="upcoming-item-name">${escapeHTML(task.title)}</span>
      <span class="upcoming-item-date">${dayLabel}</span>
    `;

    item.addEventListener('click', () => {
      openDetailsPanel(task.id);
    });

    if (task.dueDate === todayStr || diff < 0) {
      DOM.upcomingTodayList.appendChild(item);
    } else if (task.dueDate === tomorrowStr) {
      DOM.upcomingTomorrowList.appendChild(item);
    } else if (diff > 1 && diff <= 7) {
      DOM.upcomingWeekList.appendChild(item);
    }
  });

  // Empty state handling
  if (DOM.upcomingTodayList.innerHTML === '') {
    DOM.upcomingTodayList.innerHTML = '<div class="subtitle text-center" style="padding: 4px;">No items due.</div>';
  }
  if (DOM.upcomingTomorrowList.innerHTML === '') {
    DOM.upcomingTomorrowList.innerHTML = '<div class="subtitle text-center" style="padding: 4px;">Clear schedule.</div>';
  }
  if (DOM.upcomingWeekList.innerHTML === '') {
    DOM.upcomingWeekList.innerHTML = '<div class="subtitle text-center" style="padding: 4px;">Clear week.</div>';
  }
}

// 4d. Render Habits Checklist Tracker
function renderHabitsTracker() {
  DOM.habitsChecklist.innerHTML = '';
  
  const total = state.habits.length;
  const completed = state.habits.filter(h => h.checked).length;
  
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  DOM.habitsProgressPct.textContent = `${pct}%`;
  DOM.habitsProgressFill.style.width = `${pct}%`;

  state.habits.forEach(habit => {
    const li = document.createElement('li');
    li.className = `checklist-item ${habit.checked ? 'checked' : ''}`;
    
    li.innerHTML = `
      <input type="checkbox" ${habit.checked ? 'checked' : ''} aria-label="Toggle habit">
      <span>${escapeHTML(habit.name)}</span>
      <button class="icon-btn-small habit-delete-btn" title="Remove Habit">
        <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="1.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    li.querySelector('input').addEventListener('change', (e) => {
      habit.checked = e.target.checked;
      renderApp();
    });

    li.querySelector('.habit-delete-btn').addEventListener('click', () => {
      state.habits = state.habits.filter(h => h.id !== habit.id);
      renderApp();
    });

    DOM.habitsChecklist.appendChild(li);
  });
}

// 4e. Render Meal Planner Inputs
function renderMealInputs() {
  DOM.mealSnackInput.value = state.mealPlanner.snack || '';
  DOM.mealBreakfastInput.value = state.mealPlanner.breakfast || '';
  DOM.mealLunchInput.value = state.mealPlanner.lunch || '';
}

// 4f. Render Shopping Checklist List
function renderShoppingList() {
  DOM.shoppingChecklist.innerHTML = '';
  
  state.shoppingItems.forEach(item => {
    const li = document.createElement('li');
    li.className = `checklist-item ${item.checked ? 'checked' : ''}`;
    
    li.innerHTML = `
      <input type="checkbox" ${item.checked ? 'checked' : ''} aria-label="Toggle grocery item">
      <span>${escapeHTML(item.name)}</span>
      <button class="icon-btn-small shopping-delete-btn" title="Remove Item">
        <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="1.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    li.querySelector('input').addEventListener('change', (e) => {
      item.checked = e.target.checked;
      renderApp();
    });

    li.querySelector('.shopping-delete-btn').addEventListener('click', () => {
      state.shoppingItems = state.shoppingItems.filter(s => s.id !== item.id);
      renderApp();
    });

    DOM.shoppingChecklist.appendChild(li);
  });
}

// 4g. Render Finance Ledger
function renderFinanceTracker() {
  if (!DOM.financeLogsList) return;
  DOM.financeLogsList.innerHTML = '';
  
  let incomeTotal = 0;
  let expenseTotal = 0;

  state.finances.forEach(log => {
    if (log.type === 'income') incomeTotal += log.amount;
    else expenseTotal += log.amount;

    const li = document.createElement('li');
    li.className = 'finance-log-item';
    
    const displayAmt = log.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const sign = log.type === 'income' ? '+' : '-';
    
    li.innerHTML = `
      <span class="finance-log-desc">${escapeHTML(log.description)}</span>
      <span class="finance-log-amt ${log.type === 'income' ? 'inc' : 'exp'}">${sign}$${displayAmt}</span>
    `;
    DOM.financeLogsList.appendChild(li);
  });

  const netBalance = incomeTotal - expenseTotal;

  if (DOM.finIncome) {
    DOM.finIncome.textContent = `$${incomeTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  }
  DOM.finExpense.textContent = `$${expenseTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  DOM.finBalance.textContent = `$${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  if (netBalance < 0) {
    DOM.finBalance.className = 'fin-val text-danger';
  } else {
    DOM.finBalance.className = 'fin-val text-success';
  }
}

// ==========================================================================
// 5. Spotify Player Setup & Controller Logic
// ==========================================================================
// ==========================================================================
// 5. Custom HTML5 Music Player & Spotify Iframe Controller Logic
// ==========================================================================
function setupSpotifyWidget() {
  setupAudioPlayerListeners();
  renderPresets();
  renderSpotifyLibrary();
  renderRecentSearches();
  setupSuggestionTags();

  if (state.activePlayerType === 'spotify') {
    loadSpotifyUrl(state.spotifyUrl, false);
  } else {
    // Load default preset "Lofi Beats" silently on start
    const defaultPreset = "Lofi Beats";
    searchTracks(defaultPreset, false).then(() => {
      if (state.musicQueue && state.musicQueue.length > 0) {
        loadTrack(0, false); // Load without autoplaying
      }
    });
  }
}

function setupAudioPlayerListeners() {
  audioPlayer.addEventListener('timeupdate', () => {
    if (!audioPlayer.duration || isNaN(audioPlayer.duration)) return;
    const progressPct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    if (!isNaN(progressPct)) {
      gsap.to(DOM.playerProgressFill, { width: `${progressPct}%`, duration: 0.1, overwrite: "auto" });
    }
    DOM.playerTimeCurrent.textContent = formatTime(audioPlayer.currentTime);
  });

  audioPlayer.addEventListener('loadedmetadata', () => {
    DOM.playerTimeTotal.textContent = formatTime(audioPlayer.duration);
    DOM.playerPrevBtn.disabled = false;
    DOM.playerPlayBtn.disabled = false;
    DOM.playerNextBtn.disabled = false;
    DOM.playerFavBtn.disabled = false;
  });

  audioPlayer.addEventListener('ended', () => {
    nextTrack();
  });

  audioPlayer.addEventListener('error', (e) => {
    console.error("Audio error encountered:", e);
    showToast("Failed to load audio preview. Skipping...");
    // Auto skip to next track on failure
    setTimeout(() => {
      nextTrack();
    }, 1000);
  });

  audioPlayer.addEventListener('waiting', () => {
    DOM.playSvg.style.display = 'none';
    DOM.pauseSvg.style.display = 'none';
    DOM.spinnerSvg.style.display = 'block';
  });

  audioPlayer.addEventListener('playing', () => {
    DOM.playSvg.style.display = 'none';
    DOM.pauseSvg.style.display = 'block';
    DOM.spinnerSvg.style.display = 'none';
    
    // Animate play card active
    DOM.musicPlayerCard.classList.add('playing');
  });

  audioPlayer.addEventListener('pause', () => {
    DOM.playSvg.style.display = 'block';
    DOM.pauseSvg.style.display = 'none';
    DOM.spinnerSvg.style.display = 'none';
    
    DOM.musicPlayerCard.classList.remove('playing');
  });
}

function renderPresets() {
  DOM.spotifyPresetsContainer.innerHTML = '';
  MUSIC_PRESETS.forEach((preset, index) => {
    const btn = document.createElement('button');
    btn.className = 'preset-badge';
    btn.setAttribute('title', preset.desc);
    btn.textContent = preset.name;
    
    // Highlight preset badge if active
    const embedUrl = parseSpotifyEmbedUrl(preset.spotifyUrl);
    if (state.activePlayerType === 'spotify' && state.spotifyUrl === embedUrl) {
      btn.classList.add('active');
    }
    
    btn.addEventListener('click', () => {
      // Highlight preset badge
      const badges = DOM.spotifyPresetsContainer.querySelectorAll('.preset-badge');
      badges.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      loadSpotifyUrl(preset.spotifyUrl, true);
      showToast(`Playing Preset: ${preset.name}`);
    });
    DOM.spotifyPresetsContainer.appendChild(btn);
  });
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === Infinity) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function loadTrack(index, playImmediately = true) {
  if (!state.musicQueue || state.musicQueue.length === 0) return;
  
  if (index < 0) {
    index = state.musicQueue.length - 1;
  } else if (index >= state.musicQueue.length) {
    index = 0;
  }
  
  state.musicQueueIndex = index;
  const track = state.musicQueue[index];
  
  DOM.playerTrackTitle.textContent = track.title;
  DOM.playerTrackArtist.textContent = track.artist;
  DOM.playerAlbumArt.src = track.art || 'assets/daily_cover.png';
  
  // Reset progress elements
  gsap.set(DOM.playerProgressFill, { width: '0%' });
  DOM.playerTimeCurrent.textContent = '0:00';
  DOM.playerTimeTotal.textContent = formatTime(track.duration / 1000 || 30);
  
  audioPlayer.src = track.previewUrl;
  audioPlayer.load();
  
  updateFavBtnState();
  updateActiveResultHighlight();
  
  if (playImmediately) {
    DOM.playSvg.style.display = 'none';
    DOM.pauseSvg.style.display = 'none';
    DOM.spinnerSvg.style.display = 'block';
    
    audioPlayer.play()
      .then(() => {
        state.musicIsPlaying = true;
      })
      .catch(err => {
        console.warn("Autoplay blocked or load failed:", err);
        DOM.playSvg.style.display = 'block';
        DOM.pauseSvg.style.display = 'none';
        DOM.spinnerSvg.style.display = 'none';
        state.musicIsPlaying = false;
        showToast("Click Play to start music.");
      });
  } else {
    state.musicIsPlaying = false;
    DOM.playSvg.style.display = 'block';
    DOM.pauseSvg.style.display = 'none';
    DOM.spinnerSvg.style.display = 'none';
  }
}

async function searchTracks(query, loadFirst = false) {
  if (!query) return [];
  
  let searchQuery = query.toLowerCase().trim();
  if (searchQuery === 'chill') searchQuery = 'chill music';
  else if (searchQuery === 'lofi') searchQuery = 'lofi beats';
  else if (searchQuery === 'workout') searchQuery = 'workout playlist';
  else if (searchQuery === 'study') searchQuery = 'study music';
  else if (searchQuery === 'coding') searchQuery = 'coding music';
  else if (searchQuery === 'relaxing') searchQuery = 'relaxing music';
  else if (searchQuery === 'indian') searchQuery = 'indian chill music';
  else if (searchQuery === 'bollywood') searchQuery = 'bollywood lofi';
  
  if (state.musicSearchCache[searchQuery]) {
    const cachedTracks = state.musicSearchCache[searchQuery];
    displaySearchResults(cachedTracks);
    if (loadFirst && cachedTracks.length > 0) {
      state.musicQueue = cachedTracks;
      loadTrack(0, true);
    }
    return cachedTracks;
  }
  
  DOM.searchSpinner.style.display = 'block';
  DOM.searchResultsContainer.style.display = 'block';
  DOM.searchResultsList.innerHTML = `
    <div class="skeleton-results-loading">
      <div class="skeleton-item" style="height: 48px; background: rgba(255,255,255,0.03); margin: 4px; border-radius: 4px; animation: pulse 1.5s infinite;"></div>
      <div class="skeleton-item" style="height: 48px; background: rgba(255,255,255,0.03); margin: 4px; border-radius: 4px; animation: pulse 1.5s infinite;"></div>
      <div class="skeleton-item" style="height: 48px; background: rgba(255,255,255,0.03); margin: 4px; border-radius: 4px; animation: pulse 1.5s infinite;"></div>
    </div>
  `;
  
  try {
    const url = `https://api.audius.co/v1/tracks/search?query=${encodeURIComponent(searchQuery)}&app_name=LifePlanner`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Audius Search Network error");
    
    const resJSON = await response.json();
    const results = resJSON.data || [];
    
    const tracks = results.map(item => {
      const trackId = item.id || item.track_id;
      let art = 'assets/daily_cover.png';
      if (item.artwork) {
        art = item.artwork['480x480'] || item.artwork['150x150'] || item.artwork['1000x1000'] || art;
      }
      return {
        id: `track-${trackId}-${Math.random()}`,
        title: item.title || "Unknown Track",
        artist: (item.user && item.user.name) || "Unknown Artist",
        art: art,
        previewUrl: `https://api.audius.co/v1/tracks/${trackId}/stream?app_name=LifePlanner`,
        duration: (item.duration || 180) * 1000,
        link: `https://audius.co${item.permalink || ''}`,
        type: 'custom'
      };
    });
    
    if (tracks.length === 0) {
      console.log("Audius search returned 0 results, trying iTunes API fallback...");
      return await searchTracksFallbackITunes(searchQuery, loadFirst);
    }
    
    state.musicSearchCache[searchQuery] = tracks;
    displaySearchResults(tracks);
    
    if (loadFirst) {
      if (tracks.length > 0) {
        state.musicQueue = tracks;
        loadTrack(0, true);
      } else {
        showToast("No songs found. Try another genre or artist");
      }
    }
    return tracks;
  } catch (err) {
    console.warn("Audius search failed, trying iTunes API fallback...", err);
    return await searchTracksFallbackITunes(searchQuery, loadFirst);
  } finally {
    DOM.searchSpinner.style.display = 'none';
  }
}

async function searchTracksFallbackITunes(searchQuery, loadFirst = false) {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&media=music&limit=25`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("iTunes Search Network error");
    
    const data = await response.json();
    const results = data.results || [];
    
    const tracks = results.map(item => {
      const art = item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '300x300bb') : 'assets/daily_cover.png';
      return {
        id: `track-${item.trackId || Date.now()}-${Math.random()}`,
        title: item.trackName || "Unknown Track",
        artist: item.artistName || "Unknown Artist",
        art: art,
        previewUrl: item.previewUrl,
        duration: item.trackTimeMillis || 30000,
        link: item.trackViewUrl,
        type: 'custom'
      };
    }).filter(t => t.previewUrl);
    
    state.musicSearchCache[searchQuery] = tracks;
    displaySearchResults(tracks);
    
    if (loadFirst) {
      if (tracks.length > 0) {
        state.musicQueue = tracks;
        loadTrack(0, true);
      } else {
        showToast("No songs found. Try another genre or artist");
      }
    }
    return tracks;
  } catch (err) {
    console.error("iTunes fallback search failed:", err);
    DOM.searchResultsList.innerHTML = `<li class="search-empty-state" style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">No songs found. Try another genre or artist</li>`;
    showToast("Error searching music. Please check connection.");
    return [];
  }
}

function displaySearchResults(tracks) {
  DOM.searchResultsList.innerHTML = '';
  
  if (!tracks || tracks.length === 0) {
    DOM.searchResultsList.innerHTML = `<li class="search-empty-state" style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">No songs found. Try another genre or artist</li>`;
    return;
  }
  
  tracks.forEach((track, index) => {
    const li = document.createElement('li');
    li.className = 'search-result-item';
    
    const isCurrent = state.activePlayerType === 'custom' && state.musicQueue[state.musicQueueIndex] && state.musicQueue[state.musicQueueIndex].previewUrl === track.previewUrl;
    if (isCurrent) {
      li.classList.add('active');
    }
    
    const isFav = state.spotifyFavorites.some(fav => fav.previewUrl === track.previewUrl);
    const favIcon = isFav ? 
      `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` : 
      `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;

    const displayDuration = formatTime(track.duration / 1000);
    
    li.innerHTML = `
      <img class="result-art" src="${track.art}" alt="Artwork" loading="lazy">
      <div class="result-details">
        <span class="result-title">${escapeHTML(track.title)}</span>
        <span class="result-artist">${escapeHTML(track.artist)}</span>
      </div>
      <div class="result-actions">
        <span class="result-duration">${displayDuration}</span>
        <button class="result-add-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Remove from Library' : 'Add to Library'}">
          ${favIcon}
        </button>
      </div>
    `;
    
    li.addEventListener('click', () => {
      switchToCustomPlayer();
      state.musicQueue = tracks;
      loadTrack(index, true);
    });
    
    li.querySelector('.result-add-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const favIdx = state.spotifyFavorites.findIndex(fav => fav.previewUrl === track.previewUrl);
      if (favIdx !== -1) {
        state.spotifyFavorites.splice(favIdx, 1);
        showToast("Removed from favorites");
      } else {
        state.spotifyFavorites.push({
          id: `fav-${Date.now()}`,
          title: track.title,
          artist: track.artist,
          art: track.art,
          previewUrl: track.previewUrl,
          duration: track.duration,
          link: track.link,
          type: 'custom'
        });
        showToast("Added to favorites");
      }
      updateFavBtnState();
      renderSpotifyLibrary();
      saveData();
      displaySearchResults(tracks);
    });
    
    DOM.searchResultsList.appendChild(li);
  });
}

function updateActiveResultHighlight() {
  const currentTrack = state.musicQueue[state.musicQueueIndex];
  if (!currentTrack) return;
  
  const items = DOM.searchResultsList.querySelectorAll('.search-result-item');
  items.forEach((item, index) => {
    const track = state.musicQueue[index];
    if (track && track.previewUrl === currentTrack.previewUrl) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function updateFavBtnState() {
  const currentTrack = state.musicQueue[state.musicQueueIndex];
  if (!currentTrack) {
    DOM.playerFavBtn.disabled = true;
    DOM.playerFavBtn.classList.remove('active');
    return;
  }
  DOM.playerFavBtn.disabled = false;
  const isFav = state.spotifyFavorites.some(fav => fav.previewUrl === currentTrack.previewUrl);
  if (isFav) {
    DOM.playerFavBtn.classList.add('active');
  } else {
    DOM.playerFavBtn.classList.remove('active');
  }
}

function toggleFavoriteCurrentTrack() {
  const currentTrack = state.musicQueue[state.musicQueueIndex];
  if (!currentTrack) return;
  
  const favIdx = state.spotifyFavorites.findIndex(fav => fav.previewUrl === currentTrack.previewUrl);
  if (favIdx !== -1) {
    state.spotifyFavorites.splice(favIdx, 1);
    showToast("Removed from favorites");
  } else {
    state.spotifyFavorites.push({
      id: `fav-${Date.now()}`,
      title: currentTrack.title,
      artist: currentTrack.artist,
      art: currentTrack.art,
      previewUrl: currentTrack.previewUrl,
      duration: currentTrack.duration,
      link: currentTrack.link,
      type: 'custom'
    });
    showToast("Added to favorites");
  }
  updateFavBtnState();
  renderSpotifyLibrary();
  saveData();
}

function toggleFavoriteCurrentSpotify() {
  if (state.activePlayerType !== 'spotify') return;
  
  const embedUrl = state.spotifyUrl;
  const favIdx = state.spotifyFavorites.findIndex(fav => fav.type === 'spotify' && fav.url === embedUrl);
  if (favIdx !== -1) {
    state.spotifyFavorites.splice(favIdx, 1);
    showToast("Removed Spotify link");
  } else {
    const playlistName = prompt("Name this Spotify link:", "Spotify Playlist") || "Spotify Playlist";
    state.spotifyFavorites.push({
      id: `spot-${Date.now()}`,
      title: playlistName,
      url: embedUrl,
      type: 'spotify'
    });
    showToast("Added Spotify link to favorites");
  }
  
  renderSpotifyLibrary();
  saveData();
}

function parseSpotifyEmbedUrl(url) {
  if (!url) return '';
  url = url.trim();

  if (url.includes('/embed/')) {
    return url;
  }

  const regex = /open\.spotify\.com\/(track|playlist|album|artist|episode|show)\/([a-zA-Z0-9]+)/i;
  const match = url.match(regex);
  if (match) {
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
  }

  const uriRegex = /spotify:(track|playlist|album|artist|episode|show):([a-zA-Z0-9]+)/i;
  const uriMatch = url.match(uriRegex);
  if (uriMatch) {
    return `https://open.spotify.com/embed/${uriMatch[1]}/${uriMatch[2]}`;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  return '';
}

function loadSpotifyUrl(rawUrl, updateInput = true) {
  const embedUrl = parseSpotifyEmbedUrl(rawUrl);
  if (!embedUrl) {
    if (updateInput && rawUrl) {
      showToast("Invalid Spotify link.");
    }
    return;
  }

  state.activePlayerType = 'spotify';
  state.spotifyUrl = embedUrl;
  
  audioPlayer.pause();
  
  DOM.musicPlayerCard.style.display = 'none';
  DOM.spotifyIframeWrapper.style.display = 'block';
  
  DOM.spotifyIframeWrapper.innerHTML = `
    <iframe src="${embedUrl}" 
            width="100%" 
            height="352" 
            frameborder="0" 
            allowfullscreen="" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy">
    </iframe>
  `;

  if (updateInput) {
    DOM.musicSearchInput.value = '';
  }
  
  renderSpotifyLibrary();
  saveData();
  showToast("Loaded Spotify player");
}

function switchToCustomPlayer() {
  state.activePlayerType = 'custom';
  DOM.spotifyIframeWrapper.style.display = 'none';
  DOM.spotifyIframeWrapper.innerHTML = '';
  DOM.musicPlayerCard.style.display = 'flex';
  
  saveData();
}

function nextTrack() {
  if (state.musicQueue.length === 0) return;
  let nextIdx = state.musicQueueIndex + 1;
  if (nextIdx >= state.musicQueue.length) nextIdx = 0;
  loadTrack(nextIdx, true);
}

function prevTrack() {
  if (state.musicQueue.length === 0) return;
  let prevIdx = state.musicQueueIndex - 1;
  if (prevIdx < 0) prevIdx = state.musicQueue.length - 1;
  loadTrack(prevIdx, true);
}

function loadSpotifyFromQuery(query) {
  if (!query) return;
  
  if (query.includes('open.spotify.com') || query.startsWith('spotify:')) {
    loadSpotifyUrl(query, true);
    return;
  }

  switchToCustomPlayer();
  searchTracks(query, true);
  addRecentSearch(query);
}

function renderSpotifyLibrary() {
  DOM.spotifyFavsList.innerHTML = '';
  
  if (state.spotifyFavorites.length === 0) {
    DOM.spotifyFavsList.innerHTML = `
      <li class="subtitle text-center" style="padding: 12px; color: var(--text-dim); font-size: 0.75rem;">
        No saved tracks. Add favorites by clicking the heart.
      </li>
    `;
    return;
  }

  state.spotifyFavorites.forEach((fav, index) => {
    const li = document.createElement('li');
    li.className = 'fav-item';
    
    const isCurrent = (fav.type !== 'spotify' && state.activePlayerType === 'custom' && state.musicQueue[state.musicQueueIndex] && state.musicQueue[state.musicQueueIndex].previewUrl === fav.previewUrl) ||
                      (fav.type === 'spotify' && state.activePlayerType === 'spotify' && state.spotifyUrl === fav.url);
    if (isCurrent) {
      li.classList.add('active');
    }
    
    li.innerHTML = `
      <div class="fav-info" title="Click to load">
        <span class="fav-icon">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
        </span>
        <span class="fav-title">${escapeHTML(fav.title)} ${fav.artist ? ` - ${escapeHTML(fav.artist)}` : ''}</span>
      </div>
      <div class="fav-actions">
        <button class="fav-delete-btn" title="Delete from Library">
          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    li.querySelector('.fav-info').addEventListener('click', () => {
      if (fav.type === 'spotify') {
        loadSpotifyUrl(fav.url);
      } else {
        switchToCustomPlayer();
        state.musicQueue = [fav];
        loadTrack(0, true);
      }
    });

    li.querySelector('.fav-delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteSpotifyFavorite(fav.id);
    });

    DOM.spotifyFavsList.appendChild(li);
  });
}

function deleteSpotifyFavorite(id) {
  state.spotifyFavorites = state.spotifyFavorites.filter(f => f.id !== id);
  renderSpotifyLibrary();
  saveData();
  showToast("Removed from music library.");
}

function addRecentSearch(query) {
  if (!query) return;
  const q = query.trim();
  state.recentSearches = state.recentSearches.filter(s => s.toLowerCase() !== q.toLowerCase());
  state.recentSearches.unshift(q);
  if (state.recentSearches.length > 5) {
    state.recentSearches.pop();
  }
  renderRecentSearches();
  saveData();
}

function renderRecentSearches() {
  if (!DOM.recentSearchesList) return;
  DOM.recentSearchesList.innerHTML = '';
  
  if (state.recentSearches.length === 0) {
    DOM.recentSearchesGroup.style.display = 'none';
    return;
  }
  
  DOM.recentSearchesGroup.style.display = 'block';
  
  state.recentSearches.forEach(search => {
    const btn = document.createElement('button');
    btn.className = 'suggestion-tag';
    btn.textContent = search;
    btn.addEventListener('click', () => {
      DOM.musicSearchInput.value = search;
      loadSpotifyFromQuery(search);
      DOM.searchSuggestions.style.display = 'none';
    });
    DOM.recentSearchesList.appendChild(btn);
  });
}

function setupSuggestionTags() {
  const tags = DOM.searchSuggestions.querySelectorAll('.suggestion-tag');
  tags.forEach(tag => {
    if (!tag.closest('#recent-searches-list')) {
      tag.addEventListener('click', () => {
        const query = tag.textContent;
        DOM.musicSearchInput.value = query;
        loadSpotifyFromQuery(query);
        DOM.searchSuggestions.style.display = 'none';
      });
    }
  });
}

// ==========================================================================
// 6. Sub-widget Data Operations
// ==========================================================================

// Habits CRUD
function addHabit() {
  const name = DOM.addHabitInput.value.trim();
  if (!name) return;

  state.habits.push({
    id: `hab-${Date.now()}`,
    name: name,
    checked: false
  });

  DOM.addHabitInput.value = '';
  renderApp();
}

// Shopping CRUD
function addShoppingItem() {
  const name = DOM.addShoppingInput.value.trim();
  if (!name) return;

  state.shoppingItems.push({
    id: `shop-${Date.now()}`,
    name: name,
    checked: false
  });

  DOM.addShoppingInput.value = '';
  renderApp();
}

// Finance CRUD
function addFinanceTransaction(type) {
  const desc = DOM.finDescInput.value.trim();
  const amt = parseFloat(DOM.finAmountInput.value);

  if (!desc || isNaN(amt) || amt <= 0) {
    showToast("Specify description and valid amount.");
    return;
  }

  state.finances.push({
    id: `fin-${Date.now()}`,
    description: desc,
    amount: amt,
    type: type,
    date: getFormattedDateOffset(0)
  });

  DOM.finDescInput.value = '';
  DOM.finAmountInput.value = '';
  renderApp();
  showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} logged.`);
}

// Task CRUD operations
function createInlineTask() {
  const title = DOM.inlineAddInput.value.trim();
  if (!title) return;

  const category = DOM.inlineCategorySelect.value;
  const priority = DOM.inlinePrioritySelect.value;
  const dueDate = DOM.inlineDatePicker.value;
  const dueTime = DOM.inlineTimePicker ? DOM.inlineTimePicker.value : '';

  const newTask = {
    id: `task-${Date.now()}`,
    title: title,
    category: category,
    priority: priority,
    dueDate: dueDate || '',
    dueTime: dueTime || '',
    completed: false,
    description: '',
    createdAt: Date.now(),
    subtasks: []
  };

  state.tasks.push(newTask);
  
  DOM.inlineAddInput.value = '';
  DOM.inlineDatePicker.value = '';
  if (DOM.inlineTimePicker) DOM.inlineTimePicker.value = '';

  requestNotificationPermission(); // Ask permission when a user schedules a task
  
  renderApp();
  showToast("Planner entry added!");
}

function toggleTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    
    // Add brief animation delay
    setTimeout(() => {
      renderApp();
      if (state.selectedTaskId === id) renderDetailsPanel();
    }, 200);
  }
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  if (state.selectedTaskId === id) closeDetailsPanel();
  renderApp();
  showToast("Task deleted.");
}

function updateTaskDetails(id, fields) {
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    Object.assign(task, fields);
    renderApp();
  }
}

// ==========================================================================
// 7. Details Drawer panel control
// ==========================================================================
function openDetailsPanel(taskId) {
  state.selectedTaskId = taskId;
  renderDetailsPanel();
  DOM.detailsOverlay.classList.add('show');
  DOM.detailsPanel.classList.add('show');
}

function closeDetailsPanel() {
  state.selectedTaskId = null;
  DOM.detailsOverlay.classList.remove('show');
  DOM.detailsPanel.classList.remove('show');
}

function renderDetailsPanel() {
  const task = state.tasks.find(t => t.id === state.selectedTaskId);
  if (!task) {
    closeDetailsPanel();
    return;
  }

  DOM.detailTitleInput.value = task.title;
  DOM.detailDescInput.value = task.description || '';
  DOM.detailPrioritySelect.value = task.priority;
  DOM.detailCategorySelect.value = task.category;
  DOM.detailDatePicker.value = task.dueDate || '';
  if (DOM.detailTimePicker) DOM.detailTimePicker.value = task.dueTime || '';

  renderSubtasks(task);
}

function renderSubtasks(task) {
  DOM.subtasksList.innerHTML = '';
  
  const subtasks = task.subtasks || [];
  const total = subtasks.length;
  const completed = subtasks.filter(s => s.completed).length;

  DOM.subtasksRatio.textContent = `${completed} / ${total}`;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  DOM.subtaskProgressFill.style.width = `${pct}%`;

  subtasks.forEach(sub => {
    const li = document.createElement('li');
    li.className = `subtask-item ${sub.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <input type="checkbox" ${sub.completed ? 'checked' : ''} aria-label="Toggle subtask">
      <span>${escapeHTML(sub.title)}</span>
      <button class="icon-btn-small remove-subtask-btn" title="Remove Subtask">
        <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="1.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    li.querySelector('input').addEventListener('change', (e) => {
      sub.completed = e.target.checked;
      saveData();
      renderSubtasks(task);
    });

    li.querySelector('.remove-subtask-btn').addEventListener('click', () => {
      task.subtasks = task.subtasks.filter(s => s.id !== sub.id);
      saveData();
      renderSubtasks(task);
    });

    DOM.subtasksList.appendChild(li);
  });
}

function addSubtask() {
  const title = DOM.newSubtaskInput.value.trim();
  if (!title || !state.selectedTaskId) return;

  const task = state.tasks.find(t => t.id === state.selectedTaskId);
  if (task) {
    if (!task.subtasks) task.subtasks = [];
    task.subtasks.push({
      id: `sub-${Date.now()}`,
      title: title,
      completed: false
    });
    DOM.newSubtaskInput.value = '';
    saveData();
    renderSubtasks(task);
  }
}

// ==========================================================================
// 8. Confirm Modal
// ==========================================================================
function triggerConfirmModal(text, callback) {
  DOM.confirmModalText.textContent = text;
  confirmationCallback = callback;
  DOM.confirmModal.classList.add('show');
}

function closeConfirmModal() {
  DOM.confirmModal.classList.remove('show');
  confirmationCallback = null;
}

// ==========================================================================
// 9. Backup Import/Export Logic
// ==========================================================================
function exportPlannerState() {
  const backup = {
    tasks: state.tasks,
    habits: state.habits,
    shoppingItems: state.shoppingItems,
    finances: state.finances,
    mealPlanner: state.mealPlanner
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `life_planner_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Configuration exported.");
}

function importPlannerState(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported.tasks) state.tasks = imported.tasks;
      if (imported.habits) state.habits = imported.habits;
      if (imported.shoppingItems) state.shoppingItems = imported.shoppingItems;
      if (imported.finances) state.finances = imported.finances;
      if (imported.mealPlanner) state.mealPlanner = imported.mealPlanner;

      state.activeFilter = 'all';
      renderApp();
      showToast("Data backup loaded!");
    } catch (err) {
      showToast("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
}

// ==========================================================================
// 10. Event Listeners Registration
// ==========================================================================
function setupEventListeners() {
  // Theme Toggle click
  DOM.themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    saveData();
  });

  // Search input typing
  DOM.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderTodosTable();
  });

  // Sorting selects
  DOM.sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderTodosTable();
  });

  // Tab buttons filters
  DOM.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.getAttribute('data-filter');
      renderTodosTable();
    });
  });

  // Category card covers links clicks: sets tabs filter instantly!
  DOM.cardLinkBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetFilter = btn.getAttribute('data-target');
      
      // Scroll smoothly to the overview layout section
      document.querySelector('.overview-spotify-row').scrollIntoView({ behavior: 'smooth' });

      // Find the tab button matching the target filter (if it exists)
      const tab = Array.from(DOM.tabBtns).find(t => t.getAttribute('data-filter') === targetFilter);
      if (tab) {
        tab.click();
      } else {
        // Fallback filter tabs
        DOM.tabBtns[0].click(); // Todos
      }
    });
  });

  // Select all checkbox header
  DOM.selectAllTasks.addEventListener('change', (e) => {
    const checked = e.target.checked;
    state.tasks.forEach(t => {
      t.completed = checked;
    });
    renderApp();
  });

  // Add Task handlers
  DOM.inlineAddBtn.addEventListener('click', createInlineTask);
  DOM.inlineAddInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') createInlineTask();
  });

  // Custom Music Player Event Listeners
  DOM.playerPlayBtn.addEventListener('click', () => {
    if (!state.musicQueue || state.musicQueue.length === 0) return;
    if (state.musicIsPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play().catch(err => {
        console.error("Playback failed:", err);
        showToast("Unable to play track preview.");
      });
    }
  });

  DOM.playerPrevBtn.addEventListener('click', prevTrack);
  DOM.playerNextBtn.addEventListener('click', nextTrack);

  DOM.playerVolumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value / 100;
  });

  DOM.playerProgressBarBg.addEventListener('click', (e) => {
    if (!audioPlayer.duration || isNaN(audioPlayer.duration)) return;
    const rect = DOM.playerProgressBarBg.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const pct = clickX / width;
    audioPlayer.currentTime = pct * audioPlayer.duration;
  });

  DOM.playerFavBtn.addEventListener('click', () => {
    if (state.activePlayerType === 'spotify') {
      toggleFavoriteCurrentSpotify();
    } else {
      toggleFavoriteCurrentTrack();
    }
  });

  DOM.musicSearchInput.addEventListener('focus', () => {
    DOM.searchSuggestions.style.display = 'block';
    renderRecentSearches();
    gsap.fromTo(DOM.searchSuggestions, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.2 });
  });

  DOM.musicSearchInput.addEventListener('blur', () => {
    setTimeout(() => {
      if (document.activeElement !== DOM.musicSearchInput) {
        gsap.to(DOM.searchSuggestions, { opacity: 0, y: -10, duration: 0.2, onComplete: () => {
          DOM.searchSuggestions.style.display = 'none';
        }});
      }
    }, 250);
  });

  let searchDebounceTimeout = null;
  DOM.musicSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    if (DOM.spotifySearchShortcutGroup) {
      if (query && !query.includes('open.spotify.com') && !query.startsWith('spotify:')) {
        DOM.spotifySearchShortcutGroup.style.display = 'block';
        DOM.spotifySearchQueryText.textContent = query;
      } else {
        DOM.spotifySearchShortcutGroup.style.display = 'none';
      }
    }

    if (searchDebounceTimeout) clearTimeout(searchDebounceTimeout);
    
    if (!query) {
      DOM.searchResultsContainer.style.display = 'none';
      DOM.searchSpinner.style.display = 'none';
      return;
    }
    
    if (query.includes('open.spotify.com') || query.startsWith('spotify:')) {
      return;
    }
    
    searchDebounceTimeout = setTimeout(() => {
      searchTracks(query, false);
    }, 400);
  });

  DOM.musicSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (searchDebounceTimeout) clearTimeout(searchDebounceTimeout);
      const query = DOM.musicSearchInput.value.trim();
      loadSpotifyFromQuery(query);
      DOM.musicSearchInput.blur();
    }
  });

  // Calendar prev/next triggers
  DOM.calPrevBtn.addEventListener('click', () => {
    currentCalendarMonth--;
    if (currentCalendarMonth < 0) {
      currentCalendarMonth = 11;
      currentCalendarYear--;
    }
    renderCalendar();
  });

  DOM.calNextBtn.addEventListener('click', () => {
    currentCalendarMonth++;
    if (currentCalendarMonth > 11) {
      currentCalendarMonth = 0;
      currentCalendarYear++;
    }
    renderCalendar();
  });

  DOM.calTodayBtn.addEventListener('click', () => {
    currentCalendarMonth = new Date().getMonth();
    currentCalendarYear = new Date().getFullYear();
    renderCalendar();
  });

  // Habits trigger additions
  DOM.addHabitBtn.addEventListener('click', addHabit);
  DOM.addHabitInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addHabit();
  });

  // Meals sync blur inputs
  DOM.mealSnackInput.addEventListener('change', (e) => {
    state.mealPlanner.snack = e.target.value;
    saveData();
  });
  DOM.mealBreakfastInput.addEventListener('change', (e) => {
    state.mealPlanner.breakfast = e.target.value;
    saveData();
  });
  DOM.mealLunchInput.addEventListener('change', (e) => {
    state.mealPlanner.lunch = e.target.value;
    saveData();
  });

  // Shopping list trigger additions
  DOM.addShoppingBtn.addEventListener('click', addShoppingItem);
  DOM.addShoppingInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addShoppingItem();
  });

  // Finance addition triggers
  if (DOM.finAddBtn) {
    DOM.finAddBtn.addEventListener('click', () => {
      const type = DOM.finTypeSelect.value;
      addFinanceTransaction(type);
    });
    DOM.finAmountInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const type = DOM.finTypeSelect.value;
        addFinanceTransaction(type);
      }
    });
    DOM.finDescInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const type = DOM.finTypeSelect.value;
        addFinanceTransaction(type);
      }
    });
  }

  // Edit details drawers hooks
  DOM.closeDetailsBtn.addEventListener('click', closeDetailsPanel);
  DOM.detailsOverlay.addEventListener('click', closeDetailsPanel);

  DOM.detailTitleInput.addEventListener('input', (e) => {
    if (state.selectedTaskId) updateTaskDetails(state.selectedTaskId, { title: e.target.value });
  });
  DOM.detailDescInput.addEventListener('input', (e) => {
    if (state.selectedTaskId) updateTaskDetails(state.selectedTaskId, { description: e.target.value });
  });
  DOM.detailPrioritySelect.addEventListener('change', (e) => {
    if (state.selectedTaskId) updateTaskDetails(state.selectedTaskId, { priority: e.target.value });
  });
  DOM.detailCategorySelect.addEventListener('change', (e) => {
    if (state.selectedTaskId) updateTaskDetails(state.selectedTaskId, { category: e.target.value });
  });
  DOM.detailDatePicker.addEventListener('change', (e) => {
    if (state.selectedTaskId) updateTaskDetails(state.selectedTaskId, { dueDate: e.target.value });
  });

  DOM.addSubtaskBtn.addEventListener('click', addSubtask);
  DOM.newSubtaskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addSubtask();
  });

  DOM.deleteTaskBtn.addEventListener('click', () => {
    if (state.selectedTaskId) {
      triggerConfirmModal("Delete this planner entry?", () => {
        deleteTask(state.selectedTaskId);
      });
    }
  });

  // Modal actions
  DOM.cancelConfirmBtn.addEventListener('click', closeConfirmModal);
  DOM.confirmActionBtn.addEventListener('click', () => {
    if (confirmationCallback) confirmationCallback();
    closeConfirmModal();
  });

  // Clear all databases
  DOM.clearAllBtn.addEventListener('click', () => {
    triggerConfirmModal("Reset entire planner boards?", () => {
      state.tasks = [];
      state.habits = [];
      state.shoppingItems = [];
      state.finances = [];
      state.mealPlanner = { snack: '', breakfast: '', lunch: '' };
      closeDetailsPanel();
      renderApp();
      showToast("Planner boards cleared.");
    });
  });

  // Overview Title Shortcut Add Button
  const overviewAddShortcutBtn = document.getElementById('overview-add-shortcut-btn');
  if (overviewAddShortcutBtn) {
    overviewAddShortcutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      DOM.inlineAddInput.focus();
      DOM.inlineAddInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast("Create task entry...");
    });
  }

  // Upcoming Widget Add Buttons
  const upcomingAddBtns = document.querySelectorAll('.upcoming-add-btn');
  upcomingAddBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const days = parseInt(btn.getAttribute('data-days'), 10);
      const dateStr = getFormattedDateOffset(days);
      DOM.inlineDatePicker.value = dateStr;
      
      // Scroll to task list
      document.querySelector('.overview-spotify-row').scrollIntoView({ behavior: 'smooth' });
      DOM.inlineAddInput.focus();
      showToast(`Set due date: ${dateStr}. Enter task details.`);
    });
  });

  // Category Card Cover links Quick-Add shortcuts
  const cardLinkAddBtns = document.querySelectorAll('.card-link-add-btn');
  cardLinkAddBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = btn.getAttribute('data-target');
      if (target === 'all' || target === 'workout' || target === 'travel' || target === 'books' || target === 'movies' || target === 'goals' || target === 'vision' || target === 'health') {
        // Scroll to task list
        document.querySelector('.overview-spotify-row').scrollIntoView({ behavior: 'smooth' });
        // If target isn't 'all', we also filter the tab!
        if (target !== 'all') {
          const tab = Array.from(DOM.tabBtns).find(t => t.getAttribute('data-filter') === target);
          if (tab) tab.click();
        }
        DOM.inlineAddInput.focus();
        showToast(`Add task entry...`);
      } else if (target === 'journal') {
        document.querySelector('.overview-spotify-row').scrollIntoView({ behavior: 'smooth' });
        const tab = Array.from(DOM.tabBtns).find(t => t.getAttribute('data-filter') === 'journal');
        if (tab) tab.click();
        DOM.inlineAddInput.focus();
        showToast(`Add journal entry...`);
      } else if (target === 'habits') {
        document.querySelector('.habits-panel').scrollIntoView({ behavior: 'smooth' });
        DOM.addHabitInput.focus();
        showToast(`Add habit entry...`);
      } else if (target === 'meals') {
        document.querySelector('.meals-panel').scrollIntoView({ behavior: 'smooth' });
        DOM.mealSnackInput.focus();
        showToast(`Add meal entry...`);
      } else if (target === 'finance') {
        const panel = document.querySelector('.finance-panel');
        if (panel) {
          panel.scrollIntoView({ behavior: 'smooth' });
          if (DOM.finDescInput) DOM.finDescInput.focus();
          showToast(`Log finance entry...`);
        }
      }
    });
  });

  // Esc keys shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDetailsPanel();
      closeConfirmModal();
    }
  });

  // Spotify Search Shortcut Click Handler
  if (DOM.spotifySearchShortcutBtn) {
    DOM.spotifySearchShortcutBtn.addEventListener('click', () => {
      const query = DOM.musicSearchInput.value.trim();
      if (query) {
        window.open(`https://open.spotify.com/search/${encodeURIComponent(query)}`, '_blank');
        DOM.musicSearchInput.blur();
      }
    });
  }

  // Sign In Event Listeners
  if (DOM.signinBtn) {
    DOM.signinBtn.addEventListener('click', handleSignin);
  }
  if (DOM.signinEmailInput) {
    DOM.signinEmailInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSignin();
    });
  }
  if (DOM.googleSigninBtn) {
    DOM.googleSigninBtn.addEventListener('click', handleGoogleSignin);
  }
  if (DOM.profileBtn) {
    DOM.profileBtn.addEventListener('click', handleSignout);
  }

  // Handle simulated Google Sign-In callbacks
  window.addEventListener('message', async (e) => {
    if (e.origin !== window.location.origin && window.location.origin !== 'null') {
      return;
    }
    
    if (e.data && e.data.type === 'google-auth-success') {
      const { email } = e.data;
      if (email) {
        registerUser(email);
        state.username = extractUsernameFromEmail(email);
        
        saveData();
        personalizeDashboard();
        
        if (DOM.signinModal) DOM.signinModal.classList.remove('show');
        
        setTimeout(() => {
          showPersonalizedWelcome();
        }, 500);
      }
    }
  });

  // Listen for real-time updates from other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'lifeplanner_registered_users') {
      syncUserCounter();
    }
  });
}

// ==========================================================================
// 11. Helper Utilities
// ==========================================================================
function getDaysDifference(dateString) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const targetDate = new Date(dateString + 'T00:00:00');
  const diffTime = targetDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function showToast(message) {
  DOM.toastMessage.textContent = message;
  DOM.toast.classList.add('show');
  
  if (window.toastTimeout) clearTimeout(window.toastTimeout);

  window.toastTimeout = setTimeout(() => {
    DOM.toast.classList.remove('show');
  }, 2500);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Initialise App
init();
