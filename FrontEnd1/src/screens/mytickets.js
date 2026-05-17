import { renderLayout } from '../components/layout.js';

const API_BASE_URL = 'http://localhost:8080';

export async function myTicketsPage() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    renderLayout(`
      <section class="pt-32 pb-24 px-4 min-h-screen flex items-center justify-center">
        <div class="text-center text-white/50">
          <p class="text-2xl font-bold mb-4">Please log in to view your tickets</p>
          <button data-route="/login" class="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl transition-colors">Sign In</button>
        </div>
      </section>
    `);
    return;
  }

  let ticketsHTML = '';

  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings/my-tickets`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load tickets');
    }

    const tickets = await response.json();

    if (!tickets || tickets.length === 0) {
      ticketsHTML = `
        <div class="col-span-full py-20 text-center text-white/50">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
          </svg>
          <p class="text-xl">No bookings found</p>
          <p class="mt-2 text-sm">You haven't booked any movies yet.</p>
        </div>
      `;
    } else {
      ticketsHTML = tickets.map(ticket => {
        const seatsBadges = ticket.seats 
          ? ticket.seats.map(s => `<span class="bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-semibold">${s}</span>`).join('') 
          : '<span class="text-white/40 text-xs">No seats</span>';

        return `
          <div class="bg-[#0d0d14] border border-white/10 rounded-3xl p-6 flex flex-col gap-6 transition-transform hover:border-white/20">
            <div class="flex gap-6">
              <img src="${ticket.moviePoster || 'https://via.placeholder.com/150x225?text=No+Poster'}" class="w-28 h-40 object-cover rounded-2xl shadow-lg shrink-0">
              <div class="flex flex-col py-1">
                <h3 class="text-2xl font-bold text-white mb-2">${ticket.movieName}</h3>
                <p class="text-white/60 text-sm mb-1">${ticket.showDate} • ${ticket.showTime}</p>
                <p class="text-white/60 text-sm mb-4">${ticket.hallName} • ${ticket.screenType}</p>
                <div class="flex flex-wrap gap-2 mt-auto">
                  ${seatsBadges}
                </div>
              </div>
            </div>
            
            <div class="pt-6 border-t border-white/10 flex justify-between items-center">
              <span class="text-white/60 font-medium">Total Paid</span>
              <span class="text-2xl font-bold text-white">$${ticket.totalPaid ? ticket.totalPaid.toFixed(2) : '0.00'}</span>
            </div>
          </div>
        `;
      }).join('');
    }

  } catch (error) {
    ticketsHTML = `
      <div class="col-span-full py-10 text-center text-red-400">
        <p class="font-bold text-lg mb-2">Error</p>
        <p>${error.message}</p>
      </div>
    `;
  }

  const content = `
    <section class="pt-32 pb-24 px-4 min-h-screen">
      <div class="max-w-5xl mx-auto">
        <div class="mb-10">
          <h1 class="text-4xl font-extrabold text-white mb-3">My Tickets</h1>
          
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          ${ticketsHTML}
        </div>
      </div>
    </section>
  `;

  renderLayout(content);
}
