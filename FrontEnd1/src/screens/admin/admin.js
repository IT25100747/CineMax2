// import { renderLayout } from '../../components/layout.js';
// import { setRoute } from '../../utils/router.js';

// const API_BASE_URL = 'http://localhost:8080';

// const adminData = {
//   bookings: [
//     { id: 'BK10241', movie: 'Stellar Void', user: 'Gobi Galli', seats: 'A3, A4', amount: '$34.00', status: 'Paid' },
//     { id: 'BK10242', movie: 'Shadow Protocol', user: 'Nadia Silva', seats: 'C5', amount: '$12.00', status: 'Pending' },
//     { id: 'BK10243', movie: 'Iron Tempest', user: 'Maya Chen', seats: 'B1, B2, B3', amount: '$51.00', status: 'Paid' }
//   ],
//   halls: [
//     { hall: 'Hall A', capacity: 100, available: 42, status: 'Open' },
//     { hall: 'Hall B', capacity: 120, available: 78, status: 'Open' },
//     { hall: 'Hall C', capacity: 80, available: 18, status: 'Maintenance' }
//   ]
// };

// export async function adminPage(page = 'dashboard') {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   if (!token || role !== 'ADMIN') {
//     renderLayout(`
//       <section class="pt-24 px-4 min-h-screen text-white">
//         <div class="max-w-xl mx-auto bg-[#0d0d14] border border-white/10 rounded-3xl p-8 text-center">
//           <h1 class="text-3xl font-bold">Admin Login Required</h1>
//           <p class="text-white/50 mt-3">Please login with an admin account to access dashboard.</p>
//           <button id="goLogin" class="mt-6 bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-semibold">
//             Go to Login
//           </button>
//         </div>
//       </section>
//     `);

//     document.getElementById('goLogin').addEventListener('click', () => {
//       setRoute('/login');
//     });

//     return;
//   }

//   let pageContent = '';

//   try {
//     pageContent = await renderContent(page);
//   } catch (error) {
//     console.error(error);
//     pageContent = `
//       <div class="bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl p-6">
//         <h2 class="text-xl font-bold">Something went wrong</h2>
//         <p class="mt-2">${error.message || 'Failed to load admin dashboard'}</p>
//       </div>
//     `;
//   }

//   renderLayout(`
//     <section class="min-h-screen pt-20 bg-[#08080d] text-white">
//       <div class="grid lg:grid-cols-[260px_1fr] min-h-screen">
//         <aside class="bg-[#0d0d14] border-r border-white/10 p-6">
//           <h2 class="text-2xl font-black mb-8">
//             Cine<span class="text-red-500">Max</span> Admin
//           </h2>

//           <nav class="space-y-2">
//             ${navItem('dashboard', 'Dashboard', page)}
//             ${navItem('users', 'Users', page)}
//             ${navItem('movies', 'Movies', page)}
//             ${navItem('bookings', 'Bookings', page)}
//             ${navItem('halls', 'Halls', page)}
//           </nav>

//           <button id="logoutBtn" class="w-full mt-10 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-semibold">
//             Logout
//           </button>
//         </aside>

//         <main class="p-6 md:p-10">
//           ${pageContent}
//         </main>
//       </div>
//     </section>
//   `);

//   bindAdminEvents();
// }

// async function renderContent(page) {
//   switch (page) {
//     case 'users':
//       return await usersPage();
//     case 'movies':
//       return await moviesPage();
//     case 'bookings':
//       return bookingsPage();
//     case 'halls':
//       return hallsPage();
//     default:
//       return await dashboardPage();
//   }
// }

// async function dashboardPage() {
//   const users = await getUsers();
//   const movies = await getMovies();

//   const revenue = adminData.bookings.reduce(
//     (sum, booking) => sum + Number(booking.amount.replace('$', '')),
//     0
//   );

//   return `
//     ${pageHeader('Dashboard', 'Overview of CineMax booking system')}

//     <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
//       ${statCard('Total Users', users.length)}
//       ${statCard('Movies', movies.length)}
//       ${statCard('Bookings', adminData.bookings.length)}
//       ${statCard('Revenue', '$' + revenue.toFixed(2))}
//     </div>

//     <div class="grid xl:grid-cols-2 gap-6">
//       <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
//         <h2 class="text-xl font-bold mb-4">Latest Movies</h2>
//         ${movies.length === 0 ? emptyBox('No movies added yet') : table(
//           ['Movie', 'Genre', 'Rating', 'Status'],
//           movies.slice(0, 5).map(m => [m.movieName, m.genre, m.rating, m.status]),
//           false
//         )}
//       </div>

//       <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
//         <h2 class="text-xl font-bold mb-4">Recent Bookings</h2>
//         ${table(
//           ['ID', 'Movie', 'User', 'Seats', 'Amount', 'Status'],
//           adminData.bookings.map(b => [b.id, b.movie, b.user, b.seats, b.amount, b.status]),
//           false
//         )}
//       </div>
//     </div>
//   `;
// }

// async function usersPage() {
//   const users = await getUsers();

//   return `
//     ${pageHeader('Users', 'Manage registered users')}

//     <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-x-auto">
//       <table class="w-full text-left">
//         <thead>
//           <tr class="border-b border-white/10">
//             <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">ID</th>
//             <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Name</th>
//             <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Gmail</th>
//             <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Phone</th>
//             <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Role</th>
//             <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           ${users.length === 0 ? `
//             <tr>
//               <td colspan="6" class="px-5 py-6 text-center text-white/50">No users found</td>
//             </tr>
//           ` : users.map(user => `
//             <tr class="border-b border-white/5 hover:bg-white/5">
//               <td class="px-5 py-4 text-sm text-white/80">${safe(user.id)}</td>
//               <td class="px-5 py-4 text-sm text-white/80">${safe(user.fullName)}</td>
//               <td class="px-5 py-4 text-sm text-white/80">${safe(user.gmail)}</td>
//               <td class="px-5 py-4 text-sm text-white/80">${safe(user.phoneNumber)}</td>
//               <td class="px-5 py-4 text-sm">
//                 ${roleBadge(user.role)}
//               </td>
//               <td class="px-5 py-4">
//                 ${user.role === 'ADMIN'
//                   ? `<span class="text-white/30 text-sm">Protected</span>`
//                   : `<button data-delete-user="${user.id}" class="text-red-400 hover:text-red-300 font-semibold text-sm">Delete</button>`
//                 }
//               </td>
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>
//     </div>
//   `;
// }

// async function moviesPage() {
//   const movies = await getMovies();

//   return `
//     ${pageHeader('Movies', 'Add, edit, and delete movies from MySQL database')}

//     <div class="grid xl:grid-cols-[420px_1fr] gap-6">
//       <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
//         <h2 id="movieFormTitle" class="text-xl font-bold mb-5">Add New Movie</h2>

//         <form id="movieForm" class="space-y-4">
//           <input type="hidden" id="movieId">

//           ${inputField('Movie Name', 'movieName', 'text', 'Enter movie name')}
//           ${inputField('Genre', 'genre', 'text', 'Sci-Fi, Action, Drama')}
//           ${inputField('Rating', 'rating', 'text', 'PG-13 / R / 8.5')}
          
//           <div>
//             <label class="block text-sm text-white/60 mb-2">Status</label>
//             <select id="status" class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500">
//               <option class="bg-[#0d0d14]" value="NOW_SHOWING">NOW_SHOWING</option>
//               <option class="bg-[#0d0d14]" value="NOT_SHOWING">NOT_SHOWING</option>
//               <option class="bg-[#0d0d14]" value="COMING_SOON">COMING_SOON</option>
//             </select>
//           </div>

//           ${inputField('Movie Time', 'movieTime', 'text', '2026-05-01 18:30')}

//           <div>
//             <label class="block text-sm text-white/60 mb-2">Description</label>
//             <textarea id="description" rows="4" placeholder="Enter movie description"
//               class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"></textarea>
//           </div>

//           <div>
//             <label class="block text-sm text-white/60 mb-2">Cast</label>
//             <textarea id="cast" rows="3" placeholder="Actor 1, Actor 2, Actor 3"
//               class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"></textarea>
//           </div>

//           ${inputField('Poster Image URL', 'posterUrl', 'url', 'https://example.com/poster.jpg')}

//           <div id="movieFormError" class="hidden text-red-400 text-sm text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl"></div>

//           <div class="flex gap-3">
//             <button id="movieSubmitBtn" type="submit" class="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-xl font-semibold">
//               Add Movie
//             </button>
//             <button id="movieResetBtn" type="button" class="px-5 bg-white/10 hover:bg-white/20 rounded-xl font-semibold">
//               Clear
//             </button>
//           </div>
//         </form>
//       </div>

//       <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-hidden">
//         <div class="p-6 border-b border-white/10">
//           <h2 class="text-xl font-bold">Movie List</h2>
//           <p class="text-white/50 text-sm mt-1">${movies.length} movies found</p>
//         </div>

//         <div class="overflow-x-auto">
//           <table class="w-full text-left">
//             <thead>
//               <tr class="border-b border-white/10">
//                 <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Poster</th>
//                 <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Movie</th>
//                 <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Genre</th>
//                 <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Rating</th>
//                 <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Status</th>
//                 <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Time</th>
//                 <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               ${movies.length === 0 ? `
//                 <tr>
//                   <td colspan="7" class="px-5 py-8 text-center text-white/50">
//                     No movies found. Add your first movie.
//                   </td>
//                 </tr>
//               ` : movies.map(movie => `
//                 <tr class="border-b border-white/5 hover:bg-white/5">
//                   <td class="px-5 py-4">
//                     <img 
//                       src="${safe(movie.posterUrl)}" 
//                       alt="${safe(movie.movieName)}"
//                       class="w-12 h-16 object-cover rounded-lg bg-white/10"
//                       onerror="this.src='https://via.placeholder.com/80x110?text=Movie'"
//                     >
//                   </td>
//                   <td class="px-5 py-4">
//                     <p class="font-semibold text-white">${safe(movie.movieName)}</p>
//                     <p class="text-xs text-white/40 max-w-[220px] truncate">${safe(movie.description)}</p>
//                   </td>
//                   <td class="px-5 py-4 text-sm text-white/80">${safe(movie.genre)}</td>
//                   <td class="px-5 py-4 text-sm text-white/80">${safe(movie.rating)}</td>
//                   <td class="px-5 py-4">${statusBadge(movie.status)}</td>
//                   <td class="px-5 py-4 text-sm text-white/80">${safe(movie.movieTime)}</td>
//                   <td class="px-5 py-4">
//                     <div class="flex gap-3">
//                       <button 
//                         data-edit-movie="${movie.id}"
//                         data-movie='${encodeAttr(JSON.stringify(movie))}'
//                         class="text-blue-400 hover:text-blue-300 font-semibold text-sm"
//                       >
//                         Edit
//                       </button>
//                       <button 
//                         data-delete-movie="${movie.id}" 
//                         class="text-red-400 hover:text-red-300 font-semibold text-sm"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   `;
// }

// function bookingsPage() {
//   return `
//     ${pageHeader('Bookings', 'Track customer ticket bookings')}
//     ${table(
//       ['ID', 'Movie', 'User', 'Seats', 'Amount', 'Status'],
//       adminData.bookings.map(b => [b.id, b.movie, b.user, b.seats, b.amount, b.status]),
//       true
//     )}
//   `;
// }

// function hallsPage() {
//   return `
//     ${pageHeader('Halls', 'Monitor cinema hall availability')}
//     ${table(
//       ['Hall', 'Capacity', 'Available', 'Status'],
//       adminData.halls.map(h => [h.hall, h.capacity, h.available, h.status]),
//       true
//     )}
//   `;
// }

// async function getUsers() {
//   return await apiRequest('/api/admin/users', 'GET', null, true);
// }

// async function deleteUser(id) {
//   return await apiRequest(`/api/admin/users/${id}`, 'DELETE', null, true);
// }

// async function getMovies() {
//   return await apiRequest('/api/movies', 'GET', null, false);
// }

// async function addMovie(movieData) {
//   return await apiRequest('/api/admin/movies', 'POST', movieData, true);
// }

// async function updateMovie(id, movieData) {
//   return await apiRequest(`/api/admin/movies/${id}`, 'PUT', movieData, true);
// }

// async function deleteMovie(id) {
//   return await apiRequest(`/api/admin/movies/${id}`, 'DELETE', null, true);
// }

// async function apiRequest(path, method = 'GET', body = null, auth = false) {
//   const headers = {
//     'Content-Type': 'application/json'
//   };

//   if (auth) {
//     const token = localStorage.getItem('token');
//     headers.Authorization = `Bearer ${token}`;
//   }

//   const response = await fetch(`${API_BASE_URL}${path}`, {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : null
//   });

//   if (response.status === 401 || response.status === 403) {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     throw new Error('Admin session expired. Please login again.');
//   }

//   if (!response.ok) {
//     let message = 'Request failed';

//     try {
//       const errorData = await response.json();
//       message = errorData.message || message;
//     } catch (e) {
//       try {
//         message = await response.text();
//       } catch (err) {}
//     }

//     throw new Error(message);
//   }

//   if (response.status === 204) {
//     return null;
//   }

//   const text = await response.text();

//   if (!text) {
//     return null;
//   }

//   try {
//     return JSON.parse(text);
//   } catch (e) {
//     return text;
//   }
// }

// function bindAdminEvents() {
//   const logoutBtn = document.getElementById('logoutBtn');

//   if (logoutBtn) {
//     logoutBtn.addEventListener('click', () => {
//       localStorage.removeItem('token');
//       localStorage.removeItem('role');
//       setRoute('/login');
//     });
//   }

//   document.querySelectorAll('[data-delete-user]').forEach(button => {
//     button.addEventListener('click', async () => {
//       const id = button.getAttribute('data-delete-user');

//       if (!confirm('Are you sure you want to delete this user?')) return;

//       try {
//         await deleteUser(id);
//         alert('User deleted successfully');
//         refreshAdminPage('users');
//       } catch (error) {
//         alert(error.message || 'Failed to delete user');
//       }
//     });
//   });

//   const movieForm = document.getElementById('movieForm');

//   if (movieForm) {
//     movieForm.addEventListener('submit', async (e) => {
//       e.preventDefault();

//       const movieId = document.getElementById('movieId').value;
//       const errorDiv = document.getElementById('movieFormError');
//       const submitBtn = document.getElementById('movieSubmitBtn');

//       errorDiv.classList.add('hidden');

//       const movieData = {
//         movieName: document.getElementById('movieName').value.trim(),
//         genre: document.getElementById('genre').value.trim(),
//         rating: document.getElementById('rating').value.trim(),
//         status: document.getElementById('status').value,
//         movieTime: document.getElementById('movieTime').value.trim(),
//         description: document.getElementById('description').value.trim(),
//         cast: document.getElementById('cast').value.trim(),
//         posterUrl: document.getElementById('posterUrl').value.trim()
//       };

//       if (!movieData.movieName || !movieData.genre || !movieData.rating || !movieData.status || !movieData.movieTime) {
//         showFormError('Please fill movie name, genre, rating, status, and movie time.');
//         return;
//       }

//       try {
//         submitBtn.disabled = true;
//         submitBtn.textContent = movieId ? 'Updating...' : 'Adding...';

//         if (movieId) {
//           await updateMovie(movieId, movieData);
//           alert('Movie updated successfully');
//         } else {
//           await addMovie(movieData);
//           alert('Movie added successfully');
//         }

//         refreshAdminPage('movies');
//       } catch (error) {
//         showFormError(error.message || 'Failed to save movie');
//       } finally {
//         submitBtn.disabled = false;
//         submitBtn.textContent = movieId ? 'Update Movie' : 'Add Movie';
//       }
//     });
//   }

//   const movieResetBtn = document.getElementById('movieResetBtn');

//   if (movieResetBtn) {
//     movieResetBtn.addEventListener('click', () => {
//       resetMovieForm();
//     });
//   }

//   document.querySelectorAll('[data-edit-movie]').forEach(button => {
//     button.addEventListener('click', () => {
//       const movie = JSON.parse(decodeAttr(button.getAttribute('data-movie')));
//       fillMovieForm(movie);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     });
//   });

//   document.querySelectorAll('[data-delete-movie]').forEach(button => {
//     button.addEventListener('click', async () => {
//       const id = button.getAttribute('data-delete-movie');

//       if (!confirm('Are you sure you want to delete this movie?')) return;

//       try {
//         await deleteMovie(id);
//         alert('Movie deleted successfully');
//         refreshAdminPage('movies');
//       } catch (error) {
//         alert(error.message || 'Failed to delete movie');
//       }
//     });
//   });
// }

// function fillMovieForm(movie) {
//   document.getElementById('movieId').value = movie.id || '';
//   document.getElementById('movieName').value = movie.movieName || '';
//   document.getElementById('genre').value = movie.genre || '';
//   document.getElementById('rating').value = movie.rating || '';
//   document.getElementById('status').value = movie.status || 'NOW_SHOWING';
//   document.getElementById('movieTime').value = movie.movieTime || '';
//   document.getElementById('description').value = movie.description || '';
//   document.getElementById('cast').value = movie.cast || '';
//   document.getElementById('posterUrl').value = movie.posterUrl || '';

//   document.getElementById('movieFormTitle').textContent = 'Edit Movie';
//   document.getElementById('movieSubmitBtn').textContent = 'Update Movie';
// }

// function resetMovieForm() {
//   document.getElementById('movieForm').reset();
//   document.getElementById('movieId').value = '';
//   document.getElementById('movieFormTitle').textContent = 'Add New Movie';
//   document.getElementById('movieSubmitBtn').textContent = 'Add Movie';
//   document.getElementById('movieFormError').classList.add('hidden');
// }

// function showFormError(message) {
//   const errorDiv = document.getElementById('movieFormError');
//   errorDiv.textContent = message;
//   errorDiv.classList.remove('hidden');
// }

// function refreshAdminPage(page) {
//   setRoute(`/admin/${page}`);

//   if (location.hash === `#/admin/${page}`) {
//     adminPage(page);
//   }
// }

// function navItem(key, label, active) {
//   const isActive = active === key || (!active && key === 'dashboard');

//   return `
//     <a 
//       href="#/admin/${key === 'dashboard' ? '' : key}"
//       class="block px-4 py-3 rounded-xl font-semibold transition
//       ${isActive ? 'bg-red-600 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}"
//     >
//       ${label}
//     </a>
//   `;
// }

// function pageHeader(title, subtitle) {
//   return `
//     <div class="mb-8">
//       <h1 class="text-4xl font-black">${title}</h1>
//       ${subtitle ? `<p class="text-white/50 mt-2">${subtitle}</p>` : ''}
//     </div>
//   `;
// }

// function statCard(title, value) {
//   return `
//     <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
//       <p class="text-white/50 text-sm">${title}</p>
//       <h3 class="text-3xl font-black mt-2">${value}</h3>
//     </div>
//   `;
// }

// function table(headers, rows, showAction = true) {
//   return `
//     <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-x-auto">
//       <table class="w-full text-left">
//         <thead>
//           <tr class="border-b border-white/10">
//             ${headers.map(h => `
//               <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">${h}</th>
//             `).join('')}
//             ${showAction ? `<th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Action</th>` : ''}
//           </tr>
//         </thead>

//         <tbody>
//           ${rows.map(row => `
//             <tr class="border-b border-white/5 hover:bg-white/5">
//               ${row.map(cell => `
//                 <td class="px-5 py-4 text-sm text-white/80">${safe(cell)}</td>
//               `).join('')}
//               ${showAction ? `
//                 <td class="px-5 py-4">
//                   <button class="text-red-400 hover:text-red-300 font-semibold text-sm">
//                     Edit
//                   </button>
//                 </td>
//               ` : ''}
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>
//     </div>
//   `;
// }

// function inputField(label, id, type, placeholder) {
//   return `
//     <div>
//       <label class="block text-sm text-white/60 mb-2">${label}</label>
//       <input 
//         type="${type}" 
//         id="${id}" 
//         placeholder="${placeholder}"
//         class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"
//       >
//     </div>
//   `;
// }

// function emptyBox(message) {
//   return `
//     <div class="text-center text-white/50 py-8">
//       ${message}
//     </div>
//   `;
// }

// function roleBadge(role) {
//   return `
//     <span class="px-3 py-1 rounded-full text-xs font-bold ${
//       role === 'ADMIN'
//         ? 'bg-red-500/20 text-red-300'
//         : 'bg-green-500/20 text-green-300'
//     }">
//       ${safe(role)}
//     </span>
//   `;
// }

// function statusBadge(status) {
//   let styles = 'bg-white/10 text-white/70';

//   if (status === 'NOW_SHOWING') {
//     styles = 'bg-green-500/20 text-green-300';
//   }

//   if (status === 'NOT_SHOWING') {
//     styles = 'bg-red-500/20 text-red-300';
//   }

//   if (status === 'COMING_SOON') {
//     styles = 'bg-yellow-500/20 text-yellow-300';
//   }

//   return `
//     <span class="px-3 py-1 rounded-full text-xs font-bold ${styles}">
//       ${safe(status)}
//     </span>
//   `;
// }

// function safe(value) {
//   if (value === null || value === undefined || value === '') {
//     return '-';
//   }

//   return String(value)
//     .replaceAll('&', '&amp;')
//     .replaceAll('<', '&lt;')
//     .replaceAll('>', '&gt;')
//     .replaceAll('"', '&quot;')
//     .replaceAll("'", '&#039;');
// }

// function encodeAttr(value) {
//   return safe(value);
// }

// function decodeAttr(value) {
//   return value
//     .replaceAll('&quot;', '"')
//     .replaceAll('&#039;', "'")
//     .replaceAll('&lt;', '<')
//     .replaceAll('&gt;', '>')
//     .replaceAll('&amp;', '&');
// }

import { renderLayout } from '../../components/layout.js';
import { setRoute } from '../../utils/router.js';

const API_BASE_URL = 'http://localhost:8080';

const adminData = {
  bookings: [
    { id: 'BK10241', movie: 'Stellar Void', user: 'Gobi Galli', seats: 'A3, A4', amount: '$34.00', status: 'Paid' },
    { id: 'BK10242', movie: 'Shadow Protocol', user: 'Nadia Silva', seats: 'C5', amount: '$12.00', status: 'Pending' },
    { id: 'BK10243', movie: 'Iron Tempest', user: 'Maya Chen', seats: 'B1, B2, B3', amount: '$51.00', status: 'Paid' }
  ],
  halls: [
    { hall: 'Hall A', capacity: 100, available: 42, status: 'Open' },
    { hall: 'Hall B', capacity: 120, available: 78, status: 'Open' },
    { hall: 'Hall C', capacity: 80, available: 18, status: 'Maintenance' }
  ],
  screenTimes: []
};

export async function adminPage(page = 'dashboard') {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || role !== 'ADMIN') {
    renderLayout(`
      <section class="pt-24 px-4 min-h-screen text-white">
        <div class="max-w-xl mx-auto bg-[#0d0d14] border border-white/10 rounded-3xl p-8 text-center">
          <h1 class="text-3xl font-bold">Admin Login Required</h1>
          <p class="text-white/50 mt-3">Please login with an admin account to access dashboard.</p>
          <button id="goLogin" class="mt-6 bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-semibold">
            Go to Login
          </button>
        </div>
      </section>
    `);

    document.getElementById('goLogin').addEventListener('click', () => {
      setRoute('/login');
    });

    return;
  }

  let pageContent = '';

  try {
    pageContent = await renderContent(page);
  } catch (error) {
    console.error(error);
    pageContent = `
      <div class="bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl p-6">
        <h2 class="text-xl font-bold">Something went wrong</h2>
        <p class="mt-2">${error.message || 'Failed to load admin dashboard'}</p>
      </div>
    `;
  }

  renderLayout(`
    <section class="min-h-screen pt-20 bg-[#08080d] text-white">
      <div class="grid lg:grid-cols-[260px_1fr] min-h-screen">
        <aside class="bg-[#0d0d14] border-r border-white/10 p-6">
          <h2 class="text-2xl font-black mb-8">
            Cine<span class="text-red-500">Max</span> Admin
          </h2>

          <nav class="space-y-2">
            ${navItem('dashboard', 'Dashboard', page)}
            ${navItem('users', 'User Management', page)}
            ${navItem('movies', 'Movies', page)}
            ${navItem('screenTimes', 'Screen Times', page)}
            ${navItem('bookings', 'Bookings', page)}
            ${navItem('halls', 'Halls', page)}
          </nav>

          <button id="logoutBtn" class="w-full mt-10 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-semibold">
            Logout
          </button>
        </aside>

        <main class="p-6 md:p-10">
          ${pageContent}
        </main>
      </div>
    </section>

    <!-- Modal Container -->
    <div id="modalContainer"></div>
  `);

  bindAdminEvents();
}

async function renderContent(page) {
  switch (page) {
    case 'users':
      return await usersPage();
    case 'movies':
      return await moviesPage();
    case 'screenTimes':
      return await screenTimesPage();
    case 'bookings':
      return await bookingsPage();
    case 'halls':
      return hallsPage();
    default:
      return await dashboardPage();
  }
}

async function dashboardPage() {
  const users = await getUsers();
  const movies = await getMovies();
  adminData.screenTimes = await getScreenTimes();

  const revenue = adminData.bookings.reduce(
    (sum, booking) => sum + Number(booking.amount.replace('$', '')),
    0
  );

  return `
    ${pageHeader('Dashboard', 'Overview of CineMax booking system')}

    <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      ${statCard('Total Users', users.length)}
      ${statCard('Movies', movies.length)}
      ${statCard('Screen Times', adminData.screenTimes.length)}
      ${statCard('Revenue', '$' + revenue.toFixed(2))}
    </div>

    <div class="grid xl:grid-cols-2 gap-6">
      <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
        <h2 class="text-xl font-bold mb-4">Latest Movies</h2>
        ${movies.length === 0 ? emptyBox('No movies added yet') : table(
          ['Movie', 'Genre', 'Rating', 'Status'],
          movies.slice(0, 5).map(m => [m.movieName, m.genre, m.rating, m.status]),
          false
        )}
      </div>

      <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
        <h2 class="text-xl font-bold mb-4">Recent Bookings</h2>
        ${table(
          ['ID', 'Movie', 'User', 'Seats', 'Amount', 'Status'],
          adminData.bookings.map(b => [b.id, b.movie, b.user, b.seats, b.amount, b.status]),
          false
        )}
      </div>
    </div>
  `;
}

async function usersPage() {
  const users = await getUsers();

  return `
    ${pageHeader('User Management', 'Manage registered users')}

    <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-white/10">
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">ID</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Name</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Gmail</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Phone</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Role</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Action</th>
          </tr>
        </thead>

        <tbody>
          ${users.length === 0 ? `
            <tr>
              <td colspan="6" class="px-5 py-6 text-center text-white/50">No users found</td>
            </tr>
          ` : users.map(user => `
            <tr class="border-b border-white/5 hover:bg-white/5">
              <td class="px-5 py-4 text-sm text-white/80">${safe(user.id)}</td>
              <td class="px-5 py-4 text-sm text-white/80">${safe(user.fullName)}</td>
              <td class="px-5 py-4 text-sm text-white/80">${safe(user.gmail)}</td>
              <td class="px-5 py-4 text-sm text-white/80">${safe(user.phoneNumber)}</td>
              <td class="px-5 py-4 text-sm">
                ${roleBadge(user.role)}
              </td>
              <td class="px-5 py-4">
                ${user.role === 'ADMIN'
                  ? `<span class="text-white/30 text-sm">Protected</span>`
                  : `<button data-delete-user="${user.id}" class="text-red-400 hover:text-red-300 font-semibold text-sm">Delete</button>`
                }
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function moviesPage() {
  const movies = await getMovies();

  return `
    ${pageHeader('Movies', 'Add, edit, and delete movies from MySQL database')}

    <div class="grid xl:grid-cols-[420px_1fr] gap-6">
      <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
        <h2 id="movieFormTitle" class="text-xl font-bold mb-5">Add New Movie</h2>

        <form id="movieForm" class="space-y-4">
          <input type="hidden" id="movieId">

          ${inputField('Movie Name', 'movieName', 'text', 'Enter movie name')}
          ${inputField('Genre', 'genre', 'text', 'Sci-Fi, Action, Drama')}
          ${inputField('Rating', 'rating', 'text', 'PG-13 / R / 8.5')}
          
          <div>
            <label class="block text-sm text-white/60 mb-2">Status</label>
            <select id="status" class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500">
              <option class="bg-[#0d0d14]" value="NOW_SHOWING">NOW_SHOWING</option>
              <option class="bg-[#0d0d14]" value="NOT_SHOWING">NOT_SHOWING</option>
              <option class="bg-[#0d0d14]" value="COMING_SOON">COMING_SOON</option>
            </select>
          </div>

          ${inputField('Movie Time', 'movieTime', 'text', '2026-05-01 18:30')}

          <div>
            <label class="block text-sm text-white/60 mb-2">Description</label>
            <textarea id="description" rows="4" placeholder="Enter movie description"
              class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"></textarea>
          </div>

          <div>
            <label class="block text-sm text-white/60 mb-2">Cast</label>
            <textarea id="cast" rows="3" placeholder="Actor 1, Actor 2, Actor 3"
              class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"></textarea>
          </div>

          ${inputField('Poster Image URL', 'posterUrl', 'url', 'https://example.com/poster.jpg')}

          <div id="movieFormError" class="hidden text-red-400 text-sm text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl"></div>

          <div class="flex gap-3">
            <button id="movieSubmitBtn" type="submit" class="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-xl font-semibold">
              Add Movie
            </button>
            <button id="movieResetBtn" type="button" class="px-5 bg-white/10 hover:bg-white/20 rounded-xl font-semibold">
              Clear
            </button>
          </div>
        </form>
      </div>

      <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-hidden">
        <div class="p-6 border-b border-white/10">
          <h2 class="text-xl font-bold">Movie List</h2>
          <p class="text-white/50 text-sm mt-1">${movies.length} movies found</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-white/10">
                <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Poster</th>
                <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Movie</th>
                <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Genre</th>
                <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Rating</th>
                <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Status</th>
                <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Time</th>
                <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Action</th>
              </tr>
            </thead>

            <tbody>
              ${movies.length === 0 ? `
                <tr>
                  <td colspan="7" class="px-5 py-8 text-center text-white/50">
                    No movies found. Add your first movie.
                  </td>
                </tr>
              ` : movies.map(movie => `
                <tr class="border-b border-white/5 hover:bg-white/5">
                  <td class="px-5 py-4">
                    <img 
                      src="${safe(movie.posterUrl)}" 
                      alt="${safe(movie.movieName)}"
                      class="w-12 h-16 object-cover rounded-lg bg-white/10"
                      onerror="this.src='https://via.placeholder.com/80x110?text=Movie'"
                    >
                  </td>
                  <td class="px-5 py-4">
                    <p class="font-semibold text-white">${safe(movie.movieName)}</p>
                    <p class="text-xs text-white/40 max-w-[220px] truncate">${safe(movie.description)}</p>
                  </td>
                  <td class="px-5 py-4 text-sm text-white/80">${safe(movie.genre)}</td>
                  <td class="px-5 py-4 text-sm text-white/80">${safe(movie.rating)}</td>
                  <td class="px-5 py-4">${statusBadge(movie.status)}</td>
                  <td class="px-5 py-4 text-sm text-white/80">${safe(movie.movieTime)}</td>
                  <td class="px-5 py-4">
                    <div class="flex gap-3">
                      <button 
                        data-edit-movie="${movie.id}"
                        data-movie='${encodeAttr(JSON.stringify(movie))}'
                        class="text-blue-400 hover:text-blue-300 font-semibold text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        data-delete-movie="${movie.id}" 
                        class="text-red-400 hover:text-red-300 font-semibold text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

async function screenTimesPage() {
  adminData.screenTimes = await getScreenTimes();

  return `
    ${pageHeader('Screen Time Management', 'Manage movie showtimes and schedules')}

    <div class="mb-6 flex justify-end">
      <button id="addScreenTimeBtn" class="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
        <span class="text-xl">+</span> Add Screen Time
      </button>
    </div>

    <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-hidden">
      <div class="p-6 border-b border-white/10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">Screen Times List</h2>
          <input 
            type="text" 
            id="screenTimeSearch"
            placeholder="Search by movie name..."
            class="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-red-500"
          >
        </div>
        <p class="text-white/50 text-sm">${adminData.screenTimes.length} screen times found</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/10">
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">ID</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Movie Name</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Date</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Time</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Screen</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Price</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Actions</th>
            </tr>
          </thead>

          <tbody id="screenTimeTableBody">
            ${renderScreenTimeRows(adminData.screenTimes)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}


function formatShowDate(date) {
  if (!date) return '';
  return String(date).slice(0, 10);
}

function formatShowTime(time) {
  if (!time) return '';
  return String(time).slice(0, 5);
}

function formatTicketPrice(price) {
  if (price === null || price === undefined || price === '') {
    return '-';
  }

  const amount = Number(price);
  const formatted = Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  return `$${formatted}`;
}

function formatScreenLabel(screenNumber) {
  if (screenNumber === null || screenNumber === undefined || screenNumber === '') {
    return '-';
  }

  return `Screen ${screenNumber}`;
}

function renderScreenTimeRows(screenTimes, searchTerm = '') {
  if (!screenTimes.length) {
    const message = searchTerm
      ? `No screen times found matching "${searchTerm}"`
      : 'No screen times found. Add your first screen time.';

    return `
      <tr>
        <td colspan="7" class="px-5 py-8 text-center text-white/50">
          ${message}
        </td>
      </tr>
    `;
  }

  return screenTimes.map(st => `
    <tr class="border-b border-white/5 hover:bg-white/5">
      <td class="px-5 py-4 text-sm text-white/80">${safe(st.id)}</td>
      <td class="px-5 py-4 text-sm font-semibold text-white">${safe(st.movieName)}</td>
      <td class="px-5 py-4 text-sm text-white/80">${safe(formatShowDate(st.showDate))}</td>
      <td class="px-5 py-4 text-sm text-white/80">${safe(formatShowTime(st.showTime))}</td>
      <td class="px-5 py-4 text-sm text-white/80">${safe(formatScreenLabel(st.screenNumber))}</td>
      <td class="px-5 py-4 text-sm font-semibold text-green-400">${safe(formatTicketPrice(st.ticketPrice))}</td>
      <td class="px-5 py-4">
        <div class="flex gap-3">
          <button
            data-edit-screentime="${st.id}"
            data-screentime='${encodeAttr(JSON.stringify(st))}'
            class="text-blue-400 hover:text-blue-300 font-semibold text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
          <button
            data-delete-screentime="${st.id}"
            class="text-red-400 hover:text-red-300 font-semibold text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderBookingRows(bookings, searchTerm = '') {
  if (!bookings.length) {
    const message = searchTerm
      ? `No bookings found matching "${searchTerm}"`
      : 'No bookings found in the system.';

    return `
      <tr>
        <td colspan="7" class="px-5 py-8 text-center text-white/50">
          ${message}
        </td>
      </tr>
    `;
  }

  return bookings.map(b => `
    <tr class="border-b border-white/5 hover:bg-white/5">
      <td class="px-5 py-4 text-sm text-white/80">${safe(b.bookingReference)}</td>
      <td class="px-5 py-4">
        <p class="font-semibold text-white">${safe(b.movieName)}</p>
        <p class="text-xs text-white/40">${safe(b.showDate)} • ${safe(b.showTime)} • Screen ${safe(b.screenNumber)}</p>
      </td>
      <td class="px-5 py-4">
        <p class="font-semibold text-white">${safe(b.customerName || 'Guest')}</p>
        <p class="text-xs text-white/40">${safe(b.customerEmail || '-')}</p>
      </td>
      <td class="px-5 py-4">
        <div class="flex flex-wrap gap-1 max-w-[150px]">
          ${b.seats && b.seats.length > 0 
            ? b.seats.map(s => `<span class="bg-white/10 text-xs px-2 py-0.5 rounded">${safe(s)}</span>`).join('') 
            : '<span class="text-white/40">-</span>'}
        </div>
      </td>
      <td class="px-5 py-4 text-sm font-semibold text-green-400">$${b.totalAmount ? b.totalAmount.toFixed(2) : '0.00'}</td>
      <td class="px-5 py-4">
        <span class="px-3 py-1 rounded-full text-xs font-bold ${
          b.status === 'CONFIRMED' || b.status === 'SUCCESS' ? 'bg-green-500/20 text-green-300' : 
          b.status === 'CANCELLED' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'
        }">${safe(b.status)}</span>
      </td>
      <td class="px-5 py-4">
        ${(b.status === 'CONFIRMED' || b.status === 'SUCCESS') ? `
          <div class="flex gap-3">
            <button
              data-edit-booking="${b.id}"
              data-booking='${encodeAttr(JSON.stringify(b))}'
              class="text-blue-400 hover:text-blue-300 font-semibold text-sm"
              title="Edit Seats"
            >
              Edit
            </button>
            <button
              data-cancel-booking="${b.id}"
              class="text-red-400 hover:text-red-300 font-semibold text-sm"
              title="Cancel Booking"
            >
              Cancel
            </button>
          </div>
        ` : `<span class="text-white/30 text-xs italic">N/A</span>`}
      </td>
    </tr>
  `).join('');
}

async function bookingsPage() {
  try {
    const bookings = await getAdminBookings();
    adminData.bookings = bookings; // Store in state for searching/modals
  } catch (error) {
    adminData.bookings = [];
    console.error("Failed to load bookings", error);
  }

  return `
    ${pageHeader('Bookings', 'Track customer ticket bookings')}

    <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-hidden">
      <div class="p-6 border-b border-white/10 flex justify-between items-center gap-4">
        <div>
          <h2 class="text-xl font-bold">All Bookings</h2>
          <p class="text-white/50 text-sm mt-1">${adminData.bookings.length} total bookings</p>
        </div>
        <div class="relative w-64">
          <input 
            type="text" 
            id="bookingSearch" 
            placeholder="Search reference, movie, customer..." 
            class="w-full bg-[#1a1a24] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-red-500"
          >
          <svg class="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/10">
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Ref</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Movie / Time</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Customer</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Seats</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Total</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Status</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Action</th>
            </tr>
          </thead>
          <tbody id="bookingTableBody">
            ${renderBookingRows(adminData.bookings)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function hallsPage() {
  return `
    ${pageHeader('Halls', 'Monitor cinema hall availability')}
    ${table(
      ['Hall', 'Capacity', 'Available', 'Status'],
      adminData.halls.map(h => [h.hall, h.capacity, h.available, h.status]),
      true
    )}
  `;
}

async function getUsers() {
  return await apiRequest('/api/admin/users', 'GET', null, true);
}

async function deleteUser(id) {
  return await apiRequest(`/api/admin/users/${id}`, 'DELETE', null, true);
}

async function getMovies() {
  return await apiRequest('/api/movies', 'GET', null, false);
}

async function addMovie(movieData) {
  return await apiRequest('/api/admin/movies', 'POST', movieData, true);
}

async function updateMovie(id, movieData) {
  return await apiRequest(`/api/admin/movies/${id}`, 'PUT', movieData, true);
}

async function deleteMovie(id) {
  return await apiRequest(`/api/admin/movies/${id}`, 'DELETE', null, true);
}

async function getScreenTimes() {
  return await apiRequest('/api/admin/screentimes', 'GET', null, true);
}

async function addScreenTime(screenTimeData) {
  return await apiRequest('/api/admin/screentimes', 'POST', screenTimeData, true);
}

async function updateScreenTime(id, screenTimeData) {
  return await apiRequest(`/api/admin/screentimes/${id}`, 'PUT', screenTimeData, true);
}

async function deleteScreenTime(id) {
  return await apiRequest(`/api/admin/screentimes/${id}`, 'DELETE', null, true);
}

// Bookings API
async function getAdminBookings() {
  return await apiRequest('/api/admin/bookings', 'GET', null, true);
}

async function cancelAdminBooking(id) {
  return await apiRequest(`/api/admin/bookings/${id}/cancel`, 'POST', null, true);
}

async function updateAdminBookingSeats(id, newSeats) {
  return await apiRequest(`/api/admin/bookings/${id}/seats`, 'POST', { newSeats }, true);
}

async function apiRequest(path, method = 'GET', body = null, auth = false) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (auth) {
    const token = localStorage.getItem('token');
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    throw new Error('Admin session expired. Please login again.');
  }

  if (!response.ok) {
    let message = 'Request failed';

    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch (e) {
      try {
        message = await response.text();
      } catch (err) {}
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

// function showAddScreenTimeModal(screenTime = null) {
//   const modalContainer = document.getElementById('modalContainer');
//   const isEditing = !!screenTime;

//   const modalHTML = `
//     <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div class="bg-[#1a1a24] border border-white/20 rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in-95">
//         <div class="flex justify-between items-center mb-6">
//           <h2 class="text-2xl font-bold text-white">${isEditing ? 'Edit Screen Time' : 'Add Screen Time'}</h2>
//           <button id="closeModalBtn" class="text-white/50 hover:text-white transition-colors">
//             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
//             </svg>
//           </button>
//         </div>

//         <form id="screenTimeForm" class="space-y-5">
//           <input type="hidden" id="screenTimeId" value="${isEditing ? screenTime.id : ''}">

//           <div>
//             <label class="block text-sm text-white/70 mb-2 font-semibold">Movie Name</label>
//             <input 
//               type="text" 
//               id="screenTimeMovieName"
//               placeholder="Enter movie name"
//               value="${isEditing ? safe(screenTime.movieName) : ''}"
//               class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/40 transition-colors"
//             >
//           </div>

//           <div class="grid grid-cols-2 gap-4">
//             <div>
//               <label class="block text-sm text-white/70 mb-2 font-semibold">Date</label>
//               <input 
//                 type="date" 
//                 id="screenTimeDate"
//                 value="${isEditing ? screenTime.date : ''}"
//                 class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/40 transition-colors"
//               >
//             </div>

//             <div>
//               <label class="block text-sm text-white/70 mb-2 font-semibold">Time</label>
//               <input 
//                 type="time" 
//                 id="screenTimeTime"
//                 value="${isEditing ? screenTime.time : ''}"
//                 class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/40 transition-colors"
//               >
//             </div>
//           </div>

//           <div class="grid grid-cols-2 gap-4">
//             <div>
//               <label class="block text-sm text-white/70 mb-2 font-semibold">Screen Number</label>
//               <input 
//                 type="text" 
//                 id="screenTimeScreen"
//                 placeholder="1-10"
//                 value="${isEditing ? safe(screenTime.screen) : ''}"
//                 class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/40 transition-colors"
//               >
//             </div>

//             <div>
//               <label class="block text-sm text-white/70 mb-2 font-semibold">Ticket Price ($)</label>
//               <input 
//                 type="number" 
//                 id="screenTimePrice"
//                 placeholder="12.00"
//                 value="${isEditing ? screenTime.price.replace('$', '') : ''}"
//                 step="0.01"
//                 min="0"
//                 class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/40 transition-colors"
//               >
//             </div>
//           </div>

//           <div id="screenTimeFormError" class="hidden text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-xl"></div>

//           <div class="flex gap-3 pt-4">
//             <button type="button" id="cancelModalBtn" class="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-semibold text-white transition-colors">
//               Cancel
//             </button>
//             <button type="submit" id="submitScreenTimeBtn" class="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-xl font-semibold text-white transition-colors">
//               ${isEditing ? 'Update' : 'Add'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   `;

//   modalContainer.innerHTML = modalHTML;

//   // Close modal
//   document.getElementById('closeModalBtn').addEventListener('click', closeModal);
//   document.getElementById('cancelModalBtn').addEventListener('click', closeModal);

//   // Handle outside click
//   document.querySelector('[role="dialog"] .fixed').addEventListener('click', (e) => {
//     if (e.target === e.currentTarget) closeModal();
//   });

//   // Form submission
//   document.getElementById('screenTimeForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const movieName = document.getElementById('screenTimeMovieName').value.trim();
//     const date = document.getElementById('screenTimeDate').value.trim();
//     const time = document.getElementById('screenTimeTime').value.trim();
//     const screen = document.getElementById('screenTimeScreen').value.trim();
//     const price = document.getElementById('screenTimePrice').value.trim();
//     const errorDiv = document.getElementById('screenTimeFormError');
//     const submitBtn = document.getElementById('submitScreenTimeBtn');

//     errorDiv.classList.add('hidden');

//     if (!movieName || !date || !time || !screen || !price) {
//       errorDiv.textContent = 'Please fill all fields.';
//       errorDiv.classList.remove('hidden');
//       return;
//     }

//     const screenTimeData = {
//       movieName,
//       date,
//       time,
//       screen,
//       price: `$${parseFloat(price).toFixed(2)}`
//     };

//     try {
//       submitBtn.disabled = true;
//       submitBtn.textContent = isEditing ? 'Updating...' : 'Adding...';

//       if (isEditing) {
//         await updateScreenTime(screenTime.id, screenTimeData);
//         // Update local data
//         const index = adminData.screenTimes.findIndex(st => st.id === screenTime.id);
//         if (index !== -1) {
//           adminData.screenTimes[index] = { ...screenTime, ...screenTimeData };
//         }
//         alert('Screen time updated successfully');
//       } else {
//         await addScreenTime(screenTimeData);
//         // Add to local data
//         const newScreenTime = {
//           id: `ST${String(adminData.screenTimes.length + 1).padStart(3, '0')}`,
//           ...screenTimeData
//         };
//         adminData.screenTimes.push(newScreenTime);
//         alert('Screen time added successfully');
//       }

//       closeModal();
//       refreshAdminPage('screenTimes');
//     } catch (error) {
//       errorDiv.textContent = error.message || 'Failed to save screen time';
//       errorDiv.classList.remove('hidden');
//       submitBtn.disabled = false;
//       submitBtn.textContent = isEditing ? 'Update' : 'Add';
//     }
//   });
// }

function showAddScreenTimeModal(screenTime = null) {
  const modalContainer = document.getElementById('modalContainer');
  const isEditing = !!screenTime;

  const modalHTML = `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-[#1a1a24] border border-white/20 rounded-2xl w-full max-w-lg p-8">

        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white">
            ${isEditing ? 'Edit Screen Time' : 'Add Screen Time'}
          </h2>

          <button id="closeModalBtn" class="text-white/50 hover:text-white">
            ✕
          </button>
        </div>

        <form id="screenTimeForm" class="space-y-5">

          <input
            type="hidden"
            id="screenTimeId"
            value="${isEditing ? screenTime.id : ''}"
          >

          <div>
            <label class="block text-sm text-white/70 mb-2 font-semibold">
              Movie Name
            </label>

            <input
              type="text"
              id="screenTimeMovieName"
              value="${isEditing ? safe(screenTime.movieName) : ''}"
              placeholder="Enter movie name"
              class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white"
              required
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-white/70 mb-2 font-semibold">
                Date
              </label>

              <input
                type="date"
                id="screenTimeDate"
                value="${isEditing ? formatShowDate(screenTime.showDate) : ''}"
                class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white"
                required
              >
            </div>

            <div>
              <label class="block text-sm text-white/70 mb-2 font-semibold">
                Time
              </label>

              <input
                type="time"
                id="screenTimeTime"
                value="${isEditing ? formatShowTime(screenTime.showTime) : ''}"
                class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white"
                required
              >
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-white/70 mb-2 font-semibold">
                Screen Number
              </label>

              <input
                type="number"
                id="screenTimeScreen"
                value="${isEditing ? screenTime.screenNumber || '' : ''}"
                placeholder="1-10"
                class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white"
                required
              >
            </div>

            <div>
              <label class="block text-sm text-white/70 mb-2 font-semibold">
                Ticket Price
              </label>

              <input
                type="number"
                id="screenTimePrice"
                step="0.01"
                min="0"
                value="${isEditing ? screenTime.ticketPrice || '' : ''}"
                placeholder="12.00"
                class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white"
                required
              >
            </div>
          </div>

          <div
            id="screenTimeFormError"
            class="hidden text-red-400 text-sm p-3 bg-red-500/10 rounded-xl"
          ></div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              id="cancelModalBtn"
              class="flex-1 bg-white/10 py-3 rounded-xl text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="submitScreenTimeBtn"
              class="flex-1 bg-red-600 py-3 rounded-xl text-white font-semibold"
            >
              ${isEditing ? 'Update' : 'Add'}
            </button>
          </div>

        </form>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHTML;

  document
    .getElementById('closeModalBtn')
    .addEventListener('click', closeModal);

  document
    .getElementById('cancelModalBtn')
    .addEventListener('click', closeModal);

  document
    .getElementById('screenTimeForm')
    .addEventListener('submit', handleSubmit);

  async function handleSubmit(e) {
    e.preventDefault();

    const errorBox = document.getElementById('screenTimeFormError');
    const submitBtn = document.getElementById('submitScreenTimeBtn');

    errorBox.classList.add('hidden');

    try {
      submitBtn.disabled = true;

      const movieName = document
        .getElementById('screenTimeMovieName')
        .value.trim();

      const showDate = document
        .getElementById('screenTimeDate')
        .value;

      const timeValue = document.getElementById('screenTimeTime').value;
      const showTime = timeValue.length === 5 ? `${timeValue}:00` : timeValue;

      const screenNumber = parseInt(
        document.getElementById('screenTimeScreen').value
      );

      const ticketPrice = parseFloat(
        document.getElementById('screenTimePrice').value
      );

      /*
      STEP 1:
      Get movies and find movieId
      */

      const movies = await getMovies();

      const matchedMovie = movies.find(
        movie =>
          movie.movieName.toLowerCase() === movieName.toLowerCase()
      );

      if (!matchedMovie) {
        throw new Error(
          'Movie not found. Please add movie first.'
        );
      }

      /*
      STEP 2:
      Backend payload
      */

      const payload = {
        movieId: matchedMovie.id,
        showDate,
        showTime,
        screenNumber,
        ticketPrice
      };

      /*
      STEP 3:
      Save
      */

      if (isEditing) {
        await updateScreenTime(screenTime.id, payload);
        alert('Screen Time updated successfully');
      } else {
        await addScreenTime(payload);
        alert('Screen Time added successfully');
      }

      closeModal();
      refreshAdminPage('screenTimes');

    } catch (error) {
      errorBox.textContent = error.message;
      errorBox.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
    }
  }
}

function closeModal() {
  const modalContainer = document.getElementById('modalContainer');
  if (modalContainer) {
    modalContainer.innerHTML = '';
  }
}

function bindAdminEvents() {
  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setRoute('/login');
    });
  }

  // Add Screen Time Button
  const addScreenTimeBtn = document.getElementById('addScreenTimeBtn');
  if (addScreenTimeBtn) {
    addScreenTimeBtn.addEventListener('click', () => {
      showAddScreenTimeModal();
    });
  }

  // Screen Time Search
  const screenTimeSearch = document.getElementById('screenTimeSearch');
  if (screenTimeSearch) {
    screenTimeSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const tableBody = document.getElementById('screenTimeTableBody');

      if (!tableBody) return;

      const filtered = adminData.screenTimes.filter(st =>
        st.movieName.toLowerCase().includes(searchTerm)
      );

      tableBody.innerHTML = renderScreenTimeRows(filtered, searchTerm);

      // Re-bind edit and delete events
      bindScreenTimeEvents();
    });
  }

  // Delete User
  document.querySelectorAll('[data-delete-user]').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-delete-user');

      if (!confirm('Are you sure you want to delete this user?')) return;

      try {
        await deleteUser(id);
        alert('User deleted successfully');
        refreshAdminPage('users');
      } catch (error) {
        alert(error.message || 'Failed to delete user');
      }
    });
  });

  // Movie Form
  const movieForm = document.getElementById('movieForm');

  if (movieForm) {
    movieForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const movieId = document.getElementById('movieId').value;
      const errorDiv = document.getElementById('movieFormError');
      const submitBtn = document.getElementById('movieSubmitBtn');

      errorDiv.classList.add('hidden');

      const movieData = {
        movieName: document.getElementById('movieName').value.trim(),
        genre: document.getElementById('genre').value.trim(),
        rating: document.getElementById('rating').value.trim(),
        status: document.getElementById('status').value,
        movieTime: document.getElementById('movieTime').value.trim(),
        description: document.getElementById('description').value.trim(),
        cast: document.getElementById('cast').value.trim(),
        posterUrl: document.getElementById('posterUrl').value.trim()
      };

      if (!movieData.movieName || !movieData.genre || !movieData.rating || !movieData.status || !movieData.movieTime) {
        showFormError('Please fill movie name, genre, rating, status, and movie time.');
        return;
      }

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = movieId ? 'Updating...' : 'Adding...';

        if (movieId) {
          await updateMovie(movieId, movieData);
          alert('Movie updated successfully');
        } else {
          await addMovie(movieData);
          alert('Movie added successfully');
        }

        refreshAdminPage('movies');
      } catch (error) {
        showFormError(error.message || 'Failed to save movie');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = movieId ? 'Update Movie' : 'Add Movie';
      }
    });
  }

  const movieResetBtn = document.getElementById('movieResetBtn');

  if (movieResetBtn) {
    movieResetBtn.addEventListener('click', () => {
      resetMovieForm();
    });
  }

  document.querySelectorAll('[data-edit-movie]').forEach(button => {
    button.addEventListener('click', () => {
      const movie = JSON.parse(decodeAttr(button.getAttribute('data-movie')));
      fillMovieForm(movie);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-delete-movie]').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-delete-movie');

      if (!confirm('Are you sure you want to delete this movie?')) return;

      try {
        await deleteMovie(id);
        alert('Movie deleted successfully');
        refreshAdminPage('movies');
      } catch (error) {
        alert(error.message || 'Failed to delete movie');
      }
    });
  });

  // Screen Time Events
  bindScreenTimeEvents();

  // Booking Events
  bindBookingEvents();
}

function bindBookingEvents() {
  const bookingSearch = document.getElementById('bookingSearch');
  if (bookingSearch) {
    bookingSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const tableBody = document.getElementById('bookingTableBody');

      if (!tableBody) return;

      const filtered = adminData.bookings.filter(b =>
        (b.bookingReference && b.bookingReference.toLowerCase().includes(searchTerm)) ||
        (b.movieName && b.movieName.toLowerCase().includes(searchTerm)) ||
        (b.customerName && b.customerName.toLowerCase().includes(searchTerm)) ||
        (b.customerEmail && b.customerEmail.toLowerCase().includes(searchTerm))
      );

      tableBody.innerHTML = renderBookingRows(filtered, searchTerm);
      
      // Re-bind buttons inside the newly rendered rows
      bindBookingActionButtons();
    });
  }

  bindBookingActionButtons();
}

function bindBookingActionButtons() {
  // Cancel Booking
  document.querySelectorAll('[data-cancel-booking]').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-cancel-booking');

      if (!confirm('Are you sure you want to cancel this booking? The seats will be released immediately.')) return;

      try {
        await cancelAdminBooking(id);
        alert('Booking cancelled successfully.');
        refreshAdminPage('bookings');
      } catch (error) {
        alert(error.message || 'Failed to cancel booking.');
      }
    });
  });

  // Edit Seats
  document.querySelectorAll('[data-edit-booking]').forEach(button => {
    button.addEventListener('click', () => {
      const booking = JSON.parse(decodeAttr(button.getAttribute('data-booking')));
      showEditSeatsModal(booking);
    });
  });
}

function bindScreenTimeEvents() {
  // Edit Screen Time
  document.querySelectorAll('[data-edit-screentime]').forEach(button => {
    button.addEventListener('click', () => {
      const screenTime = JSON.parse(decodeAttr(button.getAttribute('data-screentime')));
      showAddScreenTimeModal(screenTime);
    });
  });

  // Delete Screen Time
  document.querySelectorAll('[data-delete-screentime]').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-delete-screentime');

      if (!confirm('Are you sure you want to delete this screen time?')) return;

      try {
        await deleteScreenTime(id);
        alert('Screen time deleted successfully');
        refreshAdminPage('screenTimes');
      } catch (error) {
        alert(error.message || 'Failed to delete screen time');
      }
    });
  });
}

function fillMovieForm(movie) {
  document.getElementById('movieId').value = movie.id || '';
  document.getElementById('movieName').value = movie.movieName || '';
  document.getElementById('genre').value = movie.genre || '';
  document.getElementById('rating').value = movie.rating || '';
  document.getElementById('status').value = movie.status || 'NOW_SHOWING';
  document.getElementById('movieTime').value = movie.movieTime || '';
  document.getElementById('description').value = movie.description || '';
  document.getElementById('cast').value = movie.cast || '';
  document.getElementById('posterUrl').value = movie.posterUrl || '';

  document.getElementById('movieFormTitle').textContent = 'Edit Movie';
  document.getElementById('movieSubmitBtn').textContent = 'Update Movie';
}

function resetMovieForm() {
  document.getElementById('movieForm').reset();
  document.getElementById('movieId').value = '';
  document.getElementById('movieFormTitle').textContent = 'Add New Movie';
  document.getElementById('movieSubmitBtn').textContent = 'Add Movie';
  document.getElementById('movieFormError').classList.add('hidden');
}

function showFormError(message) {
  const errorDiv = document.getElementById('movieFormError');
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}

function refreshAdminPage(page) {
  setRoute(`/admin/${page}`);

  if (location.hash === `#/admin/${page}`) {
    adminPage(page);
  }
}

function navItem(key, label, active) {
  const isActive = active === key || (!active && key === 'dashboard');

  return `
    <a 
      href="#/admin/${key === 'dashboard' ? '' : key}"
      class="block px-4 py-3 rounded-xl font-semibold transition
      ${isActive ? 'bg-red-600 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}"
    >
      ${label}
    </a>
  `;
}

function pageHeader(title, subtitle) {
  return `
    <div class="mb-8">
      <h1 class="text-4xl font-black">${title}</h1>
      ${subtitle ? `<p class="text-white/50 mt-2">${subtitle}</p>` : ''}
    </div>
  `;
}

function statCard(title, value) {
  return `
    <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
      <p class="text-white/50 text-sm">${title}</p>
      <h3 class="text-3xl font-black mt-2">${value}</h3>
    </div>
  `;
}

function table(headers, rows, showAction = true) {
  return `
    <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-white/10">
            ${headers.map(h => `
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">${h}</th>
            `).join('')}
            ${showAction ? `<th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Action</th>` : ''}
          </tr>
        </thead>

        <tbody>
          ${rows.map(row => `
            <tr class="border-b border-white/5 hover:bg-white/5">
              ${row.map(cell => `
                <td class="px-5 py-4 text-sm text-white/80">${safe(cell)}</td>
              `).join('')}
              ${showAction ? `
                <td class="px-5 py-4">
                  <button class="text-red-400 hover:text-red-300 font-semibold text-sm">
                    Edit
                  </button>
                </td>
              ` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function inputField(label, id, type, placeholder) {
  return `
    <div>
      <label class="block text-sm text-white/60 mb-2">${label}</label>
      <input 
        type="${type}" 
        id="${id}" 
        placeholder="${placeholder}"
        class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"
      >
    </div>
  `;
}

function emptyBox(message) {
  return `
    <div class="text-center text-white/50 py-8">
      ${message}
    </div>
  `;
}

function roleBadge(role) {
  return `
    <span class="px-3 py-1 rounded-full text-xs font-bold ${
      role === 'ADMIN'
        ? 'bg-red-500/20 text-red-300'
        : 'bg-green-500/20 text-green-300'
    }">
      ${safe(role)}
    </span>
  `;
}

function statusBadge(status) {
  let styles = 'bg-white/10 text-white/70';

  if (status === 'NOW_SHOWING') {
    styles = 'bg-green-500/20 text-green-300';
  }

  if (status === 'NOT_SHOWING') {
    styles = 'bg-red-500/20 text-red-300';
  }

  if (status === 'COMING_SOON') {
    styles = 'bg-yellow-500/20 text-yellow-300';
  }

  return `
    <span class="px-3 py-1 rounded-full text-xs font-bold ${styles}">
      ${safe(status)}
    </span>
  `;
}

function safe(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function encodeAttr(value) {
  return safe(value);
}

function decodeAttr(value) {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}

function showEditSeatsModal(booking) {
  const modalContainer = document.getElementById('modalContainer');
  
  const modalHTML = `
    <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div class="bg-[#1a1a24] border border-white/20 rounded-2xl w-full max-w-4xl p-8 flex flex-col max-h-[90vh]">
        
        <div class="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h2 class="text-2xl font-bold text-white">Edit Seats for ${safe(booking.bookingReference)}</h2>
            <p class="text-white/50 text-sm mt-1">${safe(booking.movieName)} • Screen ${safe(booking.screenNumber)}</p>
          </div>
          <button id="closeEditSeatsBtn" class="text-white/50 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div id="editSeatsContent" class="flex-1 overflow-y-auto min-h-[300px] flex items-center justify-center">
          <p class="text-white/50 animate-pulse">Loading seat layout...</p>
        </div>

        <div class="mt-6 pt-6 border-t border-white/10 flex justify-between items-center shrink-0">
          <div class="flex gap-4 text-sm">
            <div class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-white/10"></div> <span class="text-white/60">Available</span></div>
            <div class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-red-600"></div> <span class="text-white/60">Selected</span></div>
            <div class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-white/5 border border-white/10 text-white/20 flex items-center justify-center">×</div> <span class="text-white/60">Taken</span></div>
          </div>
          <div class="flex gap-3">
            <button id="cancelEditSeatsBtn" class="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-white transition-colors">Cancel</button>
            <button id="saveEditSeatsBtn" disabled class="px-6 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-colors">Save Changes</button>
          </div>
        </div>

      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHTML;

  const closeFn = () => { modalContainer.innerHTML = ''; };
  document.getElementById('closeEditSeatsBtn').addEventListener('click', closeFn);
  document.getElementById('cancelEditSeatsBtn').addEventListener('click', closeFn);

  loadSeatMapForAdmin(booking, closeFn);
}

async function loadSeatMapForAdmin(booking, closeFn) {
  try {
    if (!booking.screenTimeId) throw new Error("Missing screenTimeId for this booking");

    const response = await fetch(`${API_BASE_URL}/api/screentimes/${booking.screenTimeId}/seats`);
    if (!response.ok) throw new Error("Failed to load seat availability.");
    const allReservedSeats = await response.json();

    let currentBookingSeats = [...(booking.seats || [])];
    let selectedSeats = [...currentBookingSeats];

    const contentDiv = document.getElementById('editSeatsContent');
    const saveBtn = document.getElementById('saveEditSeatsBtn');

    const renderMap = () => {
      const rows = ['A','B','C','D','E','F','G'];
      
      let html = `
        <div class="w-full max-w-2xl mx-auto py-8">
          <div class="relative w-full h-12 mb-16 perspective-1000">
            <div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-t-full transform rotateX-45 blur-[2px]"></div>
            <div class="absolute inset-0 bg-white/10 rounded-t-full transform rotateX-45 blur-md shadow-[0_-10px_30px_rgba(255,255,255,0.1)]"></div>
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.5em] font-bold">SCREEN</div>
          </div>
          <div class="flex flex-col gap-3 items-center">
      `;

      rows.forEach(row => {
        html += `<div class="flex items-center gap-4"><div class="w-6 text-center font-mono text-white/30 text-sm font-bold">${row}</div><div class="flex gap-2">`;
        for (let i = 1; i <= 14; i++) {
          if (i === 4 || i === 12) html += `<div class="w-4"></div>`;

          const seatId = `${row}${i}`;
          const isCurrentBookingSeat = currentBookingSeats.includes(seatId);
          const isTakenBySomeoneElse = allReservedSeats.includes(seatId) && !isCurrentBookingSeat;
          const isSelected = selectedSeats.includes(seatId);

          let seatClass = "w-8 h-8 rounded-t-lg rounded-b-sm transition-all duration-300 flex items-center justify-center text-[10px] font-bold font-mono cursor-pointer ";

          if (isTakenBySomeoneElse) {
            seatClass += "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed";
            html += `<div class="${seatClass}">×</div>`;
          } else if (isSelected) {
            seatClass += "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] transform scale-110";
            html += `<div class="${seatClass}" data-seat="${seatId}">${i}</div>`;
          } else {
            seatClass += "bg-white/10 text-white/40 hover:bg-white/20 hover:text-white";
            html += `<div class="${seatClass}" data-seat="${seatId}">${i}</div>`;
          }
        }
        html += `</div></div>`;
      });

      html += `</div></div>`;
      contentDiv.innerHTML = html;

      contentDiv.querySelectorAll('[data-seat]').forEach(el => {
        el.addEventListener('click', (e) => {
          const s = e.currentTarget.getAttribute('data-seat');
          if (selectedSeats.includes(s)) {
            selectedSeats = selectedSeats.filter(x => x !== s);
          } else {
            selectedSeats.push(s);
          }
          
          const seatsChanged = JSON.stringify([...selectedSeats].sort()) !== JSON.stringify([...currentBookingSeats].sort());
          saveBtn.disabled = selectedSeats.length === 0 || !seatsChanged;
          
          renderMap();
        });
      });
    };

    renderMap();

    saveBtn.addEventListener('click', async () => {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
      try {
        await updateAdminBookingSeats(booking.id, selectedSeats);
        alert('Seats updated successfully!');
        closeFn();
        refreshAdminPage('bookings');
      } catch (err) {
        alert(err.message || 'Failed to update seats');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
      }
    });

  } catch (error) {
    document.getElementById('editSeatsContent').innerHTML = `
      <div class="text-red-400 text-center">
        <p class="font-bold text-xl mb-2">Error</p>
        <p>${error.message}</p>
      </div>
    `;
  }
}