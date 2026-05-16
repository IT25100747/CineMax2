//// filepath: src/screens/movieDetail.js
//import { renderLayout } from '../components/layout.js';
//import { icon, money, genres } from '../utils/helpers.js';
//import { state, findMovie, byMovie, DATES, TICKET_PRICES } from '../state/store.js';
//import { notFound } from './notFound.js';
//
///**
// * Renders the movie detail page with showtime selection
// * @param {string} id - The movie ID to display
// */
//export function detailPage(id) {
//  const movie = findMovie(id);
//  if (!movie) {
//    return notFound('Movie not found');
//  }
//
//  const dates = DATES.map(d => `
//    <button class="dateBtn px-4 py-3 rounded-xl border text-left ${state.selectedDate === d.value ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}" data-date="${d.value}">
//      <span class="block text-xs">${d.label}</span>
//      <b>${d.display}</b>
//    </button>
//  `).join('');
//
//  const showtimes = byMovie(movie.id).filter(s => s.date === state.selectedDate);
//
//  const content = `
//  <section class="pt-16">
//    <div class="relative min-h-[520px] flex items-end">
//      <img src="${movie.image}" class="absolute inset-0 w-full h-full object-cover opacity-35">
//      <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/70 to-[#0a0a0f]/20"></div>
//      <div class="relative max-w-7xl mx-auto px-4 py-12 w-full">
//        <button data-route="/" class="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8">${icon('arrow')} Back to Movies</button>
//        <div class="grid md:grid-cols-[260px_1fr] gap-8 items-end">
//          <img src="${movie.image}" class="hidden md:block rounded-2xl aspect-[2/3] object-cover poster-shadow">
//          <div>
//            <div class="flex gap-2 mb-4">${genres(movie)}</div>
//            <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight">${movie.title}</h1>
//            <div class="mt-4 flex flex-wrap gap-4 text-white/60 text-sm">
//              <span class="flex items-center gap-1">${icon('star','w-4 h-4 text-yellow-400 fill-yellow-400')} ${movie.score}/10</span>
//              <span>${movie.rating}</span>
//              <span>${movie.duration}</span>
//              <span>Director: ${movie.director}</span>
//            </div>
//            <p class="mt-6 text-white/70 max-w-3xl leading-relaxed">${movie.description}</p>
//            <p class="mt-5 text-white/45 text-sm">Cast: ${movie.cast.join(', ')}</p>
//          </div>
//        </div>
//      </div>
//    </div>
//    <div class="max-w-5xl mx-auto px-4 py-10">
//      <h2 class="text-2xl font-bold mb-5">Select Showtime</h2>
//      <div class="flex gap-3 overflow-x-auto pb-3 mb-8">${dates}</div>
//      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//        ${showtimes.length
//          ? showtimes.map(s => `
//            <button data-route="/seats/${s.id}" class="text-left bg-[#0d0d14] hover:bg-white/10 border border-white/10 hover:border-red-500/60 rounded-2xl p-5 transition">
//              <div class="flex justify-between items-start">
//                <div>
//                  <p class="font-bold text-xl">${s.time}</p>
//                  <p class="text-white/45 text-sm mt-1">${s.hall} · ${s.format}</p>
//                </div>
//                <span class="text-red-400">${icon('chevron')}</span>
//              </div>
//              <div class="mt-4 flex items-center justify-between text-xs text-white/45">
//                <span>${s.availableSeats} seats available</span>
//                <span>${money(TICKET_PRICES[s.format])}</span>
//              </div>
//            </button>
//          `).join('')
//          : '<div class="col-span-full text-white/45 border border-white/10 rounded-2xl p-8 text-center">No showtimes for this date.</div>'
//        }
//      </div>
//    </div>
//  </section>`;
//
//  renderLayout(content);
//
//  // Bind date button events
//  document.querySelectorAll('.dateBtn').forEach(b => {
//    b.addEventListener('click', () => {
//      state.selectedDate = b.dataset.date;
//      detailPage(id);
//    });
//  });
//}

// /// filepath: src/screens/movieDetail.js
//  import { renderLayout } from '../components/layout.js';
//  import { icon, money, genres } from '../utils/helpers.js';
//  import { state, DATES, TICKET_PRICES } from '../state/store.js';
//  import { notFound } from './notFound.js';

//  const API_BASE_URL = 'http://localhost:8080';

//  export async function detailPage(id) {
//    try {
//      const response = await fetch(`${API_BASE_URL}/api/movies/${id}`);

//      if (!response.ok) {
//        return notFound('Movie not found');
//      }

//      const backendMovie = await response.json();
//      const movie = convertBackendMovie(backendMovie);

//      renderMovieDetail();
//    } catch (error) {
//      console.error(error);
//      return notFound('Failed to load movie');
//    }
//  }

//  function renderMovieDetail(movie) {
//    const dates = DATES.map(d => `
//      <button class="dateBtn px-4 py-3 rounded-xl border text-left ${
//        state.selectedDate === d.value
//          ? 'bg-red-600 border-red-500 text-white'
//          : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
//      }" data-date="${d.value}">
//        <span class="block text-xs">${d.label}</span>
//        <b>${d.display}</b>
//      </button>
//    `).join('');

//    const showtimes = createShowtimes(movie);

//    const content = `
//    <section class="pt-16">
//      <div class="relative min-h-[520px] flex items-end">
//        <img
//          src="${safe(movie.image)}"
//          class="absolute inset-0 w-full h-full object-cover opacity-35"
//          onerror="this.src='https://via.placeholder.com/1200x800?text=CineMax'"
//        >

//        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/70 to-[#0a0a0f]/20"></div>

//        <div class="relative max-w-7xl mx-auto px-4 py-12 w-full">
//          <button data-route="/" class="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8">
//            ${icon('arrow')} Back to Movies
//          </button>

//          <div class="grid md:grid-cols-[260px_1fr] gap-8 items-end">
//            <img
//              src="${safe(movie.image)}"
//              class="hidden md:block rounded-2xl aspect-[2/3] object-cover poster-shadow"
//              onerror="this.src='https://via.placeholder.com/400x600?text=CineMax'"
//            >

//            <div>
//              <div class="flex gap-2 mb-4">${genres(movie)}</div>

//              <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight">
//                ${safe(movie.title)}
//              </h1>

//              <div class="mt-4 flex flex-wrap gap-4 text-white/60 text-sm">
//                <span class="flex items-center gap-1">
//                  ${icon('star','w-4 h-4 text-yellow-400 fill-yellow-400')} ${safe(movie.score)}/10
//                </span>
//                <span>${safe(movie.rating)}</span>
//                <span>${safe(movie.duration)}</span>
//                <span>Director: ${safe(movie.director)}</span>
//              </div>

//              <p class="mt-6 text-white/70 max-w-3xl leading-relaxed">
//                ${safe(movie.description)}
//              </p>

//              <p class="mt-5 text-white/45 text-sm">
//                Cast: ${movie.cast.length ? movie.cast.map(safe).join(', ') : '-'}
//              </p>
//            </div>
//          </div>
//        </div>
//      </div>

//      <div class="max-w-5xl mx-auto px-4 py-10">
//        <h2 class="text-2xl font-bold mb-5">Select Showtime</h2>

//        <div class="flex gap-3 overflow-x-auto pb-3 mb-8">
//          ${dates}
//        </div>

//        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//          ${showtimes.map(s => `
//            <button
//              data-route="/seats/${movie.id}?time=${encodeURIComponent(s.time)}"
//              class="text-left bg-[#0d0d14] hover:bg-white/10 border border-white/10 hover:border-red-500/60 rounded-2xl p-5 transition"
//            >
//              <div class="flex justify-between items-start">
//                <div>
//                  <p class="font-bold text-xl">${safe(s.time)}</p>
//                  <p class="text-white/45 text-sm mt-1">${safe(s.hall)} · ${safe(s.format)}</p>
//                </div>
//                <span class="text-red-400">${icon('chevron')}</span>
//              </div>

//              <div class="mt-4 flex items-center justify-between text-xs text-white/45">
//                <span>${s.availableSeats} seats available</span>
//                <span>${money(TICKET_PRICES[s.format] || 12)}</span>
//              </div>
//            </button>
//          `).join('')}
//        </div>
//      </div>
//    </section>`;

//    renderLayout(content);

//    document.querySelectorAll('.dateBtn').forEach(button => {
//      button.addEventListener('click', () => {
//        state.selectedDate = button.dataset.date;
//        renderMovieDetail();
//      });
//    });
//  }

//  function convertBackendMovie(movie) {
//    return {
//      id: movie.id,
//      title: movie.movieName,
//      genre: movie.genre ? movie.genre.split(',').map(g => g.trim()) : [],
//      rating: movie.rating || 'N/A',
//      status: movie.status,
//      duration: movie.movieTime || 'Time TBA',
//      image: movie.posterUrl || 'https://via.placeholder.com/400x600?text=CineMax',
//      description: movie.description || '',
//      cast: movie.cast ? movie.cast.split(',').map(c => c.trim()) : [],
//      score: extractScore(movie.rating),
//      director: 'CineMax'
//    };
//  }

//  function createShowtimes(movie) {
//    return [
//      {
//        time: movie.duration || '11:00 AM',
//        hall: 'Hall A',
//        format: '2D',
//        availableSeats: 60
//      },
//      {
//        time: '02:30 PM',
//        hall: 'Hall B',
//        format: '2D',
//        availableSeats: 45
//      },
//      {
//        time: '06:00 PM',
//        hall: 'Hall C',
//        format: 'Dolby',
//        availableSeats: 25
//      }
//    ];
//  }

//  function extractScore(rating) {
//    const number = parseFloat(rating);

//    if (!Number.isNaN(number)) {
//      return number;
//    }

//    return '8.0';
//  }

//  function safe(value) {
//    if (value === null || value === undefined || value === '') {
//      return '';
//    }

//    return String(value)
//      .replaceAll('&', '&amp;')
//      .replaceAll('<', '&lt;')
//      .replaceAll('>', '&gt;')
//      .replaceAll('"', '&quot;')
//      .replaceAll("'", '&#039;');
//  }


// filepath: src/screens/movieDetail.js

import { renderLayout } from '../components/layout.js';
import { icon, money, genres } from '../utils/helpers.js';
import { state } from '../state/store.js';
import { notFound } from './notFound.js';

const API_BASE_URL = 'http://localhost:8080';

const HALL_CAPACITIES = [100, 120, 80, 90, 110, 95];
const SCREEN_FORMATS = ['2D', '2D', 'Dolby', '3D', 'IMAX'];

let detailContext = {
  movieId: null,
  movie: null,
  screenTimes: []
};

/**
 * Movie Detail Page
 */
export async function detailPage(id) {
  try {
    const movieResponse = await fetch(`${API_BASE_URL}/api/movies/${id}`);

    if (!movieResponse.ok) {
      return notFound('Movie not found');
    }

    const backendMovie = await movieResponse.json();
    const rawScreenTimes = Array.isArray(backendMovie.screenTimes)
      ? backendMovie.screenTimes
      : await fetchScreenTimes(id);

    detailContext = {
      movieId: String(id),
      movie: convertBackendMovie(backendMovie),
      screenTimes: rawScreenTimes.map(mapScreenTime)
    };

    ensureSelectedDate(detailContext.screenTimes);
    renderMovieDetail();

  } catch (error) {
    console.error('Movie Detail Error:', error);
    return notFound('Failed to load movie');
  }
}

async function fetchScreenTimes(movieId) {
  const urls = [
    `${API_BASE_URL}/api/movies/screentimes?movieId=${movieId}`,
    `${API_BASE_URL}/api/movies/${movieId}/screentimes`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return await response.json();
      }

      console.warn('Showtimes request failed:', url, response.status);
    } catch (error) {
      console.warn('Showtimes request error:', url, error);
    }
  }

  return [];
}

/**
 * Render Movie Detail UI
 */
function renderMovieDetail() {
  const { movie, screenTimes } = detailContext;
  const dateOptions = buildDateOptions(screenTimes);
  const dates = dateOptions.map(d => `
    <button
      class="dateBtn px-4 py-3 rounded-xl border text-left min-w-[88px] ${
        state.selectedDate === d.value
          ? 'bg-red-600 border-red-500 text-white'
          : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
      }"
      data-date="${d.value}"
    >
      <span class="block text-xs">${safe(d.label)}</span>
      <b>${safe(d.display)}</b>
    </button>
  `).join('');

  const showtimes = screenTimes
    .filter(show => show.showDate === state.selectedDate)
    .sort((a, b) => a.sortTime.localeCompare(b.sortTime));

  const content = `
  <section class="pt-16">

    <div class="relative min-h-[520px] flex items-end">

      <img
        src="${safe(movie.image)}"
        class="absolute inset-0 w-full h-full object-cover opacity-35"
        onerror="this.src='https://via.placeholder.com/1200x800?text=CineMax'"
      >

      <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/70 to-[#0a0a0f]/20"></div>

      <div class="relative max-w-7xl mx-auto px-4 py-12 w-full">

        <!-- Back Button -->
        <button
          data-route="/"
          class="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8"
        >
          ${icon('arrow')} Back to Movies
        </button>

        <div class="grid md:grid-cols-[260px_1fr] gap-8 items-end">

          <img
            src="${safe(movie.image)}"
            class="hidden md:block rounded-2xl aspect-[2/3] object-cover poster-shadow"
            onerror="this.src='https://via.placeholder.com/400x600?text=CineMax'"
          >

          <div>

            <div class="flex gap-2 mb-4">
              ${genres(movie)}
            </div>

            <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight">
              ${safe(movie.title)}
            </h1>

            <div class="mt-4 flex flex-wrap gap-4 text-white/60 text-sm">

              <span class="flex items-center gap-1">
                ${icon('star', 'w-4 h-4 text-yellow-400 fill-yellow-400')}
                ${safe(movie.score)}/10
              </span>

              <span>${safe(movie.rating)}</span>
              <span>${safe(movie.duration)}</span>
              <span>Director: ${safe(movie.director)}</span>

            </div>

            <p class="mt-6 text-white/70 max-w-3xl leading-relaxed">
              ${safe(movie.description)}
            </p>

            <p class="mt-5 text-white/45 text-sm">
              Cast: ${
                movie.cast.length
                  ? movie.cast.map(safe).join(', ')
                  : '-'
              }
            </p>

          </div>
        </div>
      </div>
    </div>

    <!-- Showtime Section -->
    <div class="max-w-5xl mx-auto px-4 py-10">

      <h2 class="text-2xl font-bold mb-5">
        Select Showtime
      </h2>

      <div class="flex gap-3 overflow-x-auto pb-3 mb-8">
        ${
          dateOptions.length
            ? dates
            : '<p class="text-white/50 text-sm">No showtimes scheduled for this movie yet.</p>'
        }
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${
          showtimes.length
            ? showtimes.map(show => `
              <button
                data-route="/seats/${show.id}"
                class="text-left bg-[#0d0d14] hover:bg-white/10 border border-white/10 hover:border-red-500/60 rounded-2xl p-5 transition"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-bold text-xl">${safe(show.time)}</p>
                    <p class="text-white/45 text-sm mt-1">
                      ${safe(show.hall)} · ${safe(show.format)}
                    </p>
                  </div>
                  <span class="text-red-400">${icon('chevron')}</span>
                </div>
                <div class="mt-4 flex items-center justify-between text-xs text-white/45">
                  <span>${show.availableSeats} seats available</span>
                  <span>${money(show.ticketPrice)}</span>
                </div>
              </button>
            `).join('')
            : `
              <div class="col-span-full text-white/45 border border-white/10 rounded-2xl p-8 text-center">
                No showtimes for this date.
              </div>
            `
        }
      </div>
    </div>

  </section>
  `;

  renderLayout(content);

  /**
   * Date Button Events
   */
  document.querySelectorAll('.dateBtn').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedDate = button.dataset.date;
      renderMovieDetail();
    });
  });

  /**
   * Route Button Events
   * VERY IMPORTANT
   */
  document.querySelectorAll('[data-route]').forEach(button => {
    button.addEventListener('click', () => {
      window.location.hash = button.dataset.route;
    });
  });
}

/**
 * Convert backend movie → frontend movie
 */
function convertBackendMovie(movie) {
  return {
    id: movie.id,
    title: movie.movieName,
    genre: movie.genre
      ? movie.genre.split(',').map(g => g.trim())
      : [],
    rating: movie.rating || 'N/A',
    status: movie.status,
    duration: movie.movieTime || 'Time TBA',
    image: movie.posterUrl || 'https://via.placeholder.com/400x600?text=CineMax',
    description: movie.description || '',
    cast: movie.cast
      ? movie.cast.split(',').map(c => c.trim())
      : [],
    score: extractScore(movie.rating),
    director: 'CineMax'
  };
}


function mapScreenTime(screenTime) {
  const screenNumber = screenTime.screenNumber || 1;

  return {
    id: screenTime.id,
    showDate: toDateKey(screenTime.showDate),
    sortTime: String(screenTime.showTime || '').slice(0, 8),
    time: formatTime12h(screenTime.showTime),
    hall: screenNumberToHall(screenNumber),
    format: screenNumberToFormat(screenNumber),
    availableSeats: estimateAvailableSeats(screenTime.id, screenNumber),
    ticketPrice: screenTime.ticketPrice ?? 12
  };
}

function buildDateOptions(screenTimes) {
  const uniqueDates = [...new Set(screenTimes.map(show => show.showDate))].sort();

  return uniqueDates.map(value => {
    const date = parseLocalDate(value);
    const today = startOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let label = date.toLocaleDateString('en-US', { weekday: 'short' });

    if (sameDay(date, today)) {
      label = 'Today';
    } else if (sameDay(date, tomorrow)) {
      label = 'Tomorrow';
    }

    return {
      label,
      value,
      display: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });
}

function ensureSelectedDate(screenTimes) {
  const dates = [...new Set(screenTimes.map(show => show.showDate))].sort();

  if (!dates.length) {
    state.selectedDate = toDateKey(new Date());
    return;
  }

  if (!dates.includes(state.selectedDate)) {
    const todayKey = toDateKey(new Date());
    state.selectedDate = dates.includes(todayKey) ? todayKey : dates[0];
  }
}

function toDateKey(value) {
  return String(value).slice(0, 10);
}

function parseLocalDate(value) {
  const [year, month, day] = toDateKey(value).split('-').map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function sameDay(left, right) {
  return left.getTime() === right.getTime();
}

function screenNumberToHall(screenNumber) {
  const index = Math.max(1, Math.min(screenNumber, 26));
  return `Hall ${String.fromCharCode(64 + index)}`;
}

function screenNumberToFormat(screenNumber) {
  return SCREEN_FORMATS[(Math.max(screenNumber, 1) - 1) % SCREEN_FORMATS.length];
}

function estimateAvailableSeats(screenTimeId, screenNumber) {
  const capacity = HALL_CAPACITIES[(Math.max(screenNumber, 1) - 1) % HALL_CAPACITIES.length];
  return Math.max(15, capacity - (Number(screenTimeId) % 35));
}

function formatTime12h(time) {
  const [hourText, minuteText] = String(time).slice(0, 5).split(':');
  let hour = Number(hourText);
  const minute = minuteText || '00';
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  return `${String(hour).padStart(2, '0')}:${minute} ${period}`;
}

/**
 * Extract movie score
 */
function extractScore(rating) {
  const number = parseFloat(rating);

  if (!Number.isNaN(number)) {
    return number;
  }

  return '8.0';
}

/**
 * Safe HTML output
 */
function safe(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}