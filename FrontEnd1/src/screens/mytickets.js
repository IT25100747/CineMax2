import { renderLayout } from '../components/layout.js';
import { setRoute } from '../utils/router.js';

const API_BASE_URL = 'http://localhost:8080';

// ─── Seat layout config (must match original seats.js) ────────────────────
const ROWS = ['A','B','C','D','E','F','G','H','I','J'];
const SEATS_PER_ROW = 14;

// ─── Seat grid renderer ────────────────────────────────────────────────────
function buildSeatGrid(currentSeats, reservedByOthers, selectedSeats) {
  const reserved = new Set(reservedByOthers);
  const current  = new Set(currentSeats);
  const selected = new Set(selectedSeats);

  let html = `
    <div class="mb-6 text-center">
      <div class="inline-block bg-white/5 rounded-2xl px-10 py-3 text-xs text-white/40 tracking-widest mb-6">SCREEN</div>
    </div>
    <div class="overflow-x-auto">
      <div class="flex flex-col gap-2 min-w-max mx-auto" style="width:fit-content">
  `;

  for (const row of ROWS) {
    html += `<div class="flex items-center gap-1.5">
      <span class="text-white/40 text-xs w-4 text-right mr-1">${row}</span>`;
    for (let n = 1; n <= SEATS_PER_ROW; n++) {
      const seatId = `${row}${n}`;
      let cls, disabled = false;
      if (reserved.has(seatId)) {
        cls = 'bg-white/10 border-white/10 cursor-not-allowed text-white/20';
        disabled = true;
      } else if (selected.has(seatId)) {
        cls = 'bg-red-600 border-red-500 text-white cursor-pointer';
      } else if (current.has(seatId)) {
        // Current seats shown as pre-selected initially
        cls = 'bg-red-600/40 border-red-500/40 text-white/70 cursor-pointer';
      } else {
        cls = 'bg-white/5 border-white/10 hover:bg-white/15 text-white/60 cursor-pointer';
      }
      html += `<button 
        class="w-8 h-8 rounded-md border text-[10px] font-bold transition-all ${cls}"
        data-seat="${seatId}"
        ${disabled ? 'disabled' : ''}
        onclick="toggleSeat('${seatId}')"
      >${n}</button>`;
    }
    html += `</div>`;
  }

  html += `</div></div>
    <div class="flex items-center justify-center gap-6 mt-6 text-xs text-white/50">
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-white/5 border border-white/10 inline-block"></span>Available</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-red-600 inline-block"></span>Selected</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-white/10 inline-block"></span>Reserved</span>
    </div>`;
  return html;
}

// ─── Main page function ────────────────────────────────────────────────────
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
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to load tickets');

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
            <div class="flex justify-between items-start gap-2">
              <div class="flex gap-5 flex-1 min-w-0">
                <img src="${ticket.moviePoster || 'https://via.placeholder.com/150x225?text=No+Poster'}" class="w-24 h-36 object-cover rounded-2xl shadow-lg shrink-0">
                <div class="flex flex-col py-1 min-w-0">
                  <h3 class="text-xl font-bold text-white mb-1 truncate">${ticket.movieName}</h3>
                  <p class="text-white/60 text-sm mb-1">${ticket.showDate} • ${ticket.showTime}</p>
                  <p class="text-white/60 text-sm mb-3">${ticket.hallName} • ${ticket.screenType}</p>
                  <div class="flex flex-wrap gap-2" id="seats-${ticket.bookingId}">
                    ${seatsBadges}
                  </div>
                </div>
              </div>
              <button
                class="shrink-0 flex items-center gap-1.5 bg-white/5 hover:bg-red-600 border border-white/10 hover:border-red-500 text-white/70 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                onclick="openEditSeatsModal('${ticket.bookingId}')"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                Edit Seats
              </button>
            </div>

            ${ticket.movieStatus === 'INACTIVE' ? `
            <div class="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              This movie is no longer available for new bookings
            </div>
            ` : ''}
            
            <div class="pt-4 border-t border-white/10 flex justify-between items-center">
              <span class="text-white/60 font-medium text-sm">Total Paid</span>
              <span class="text-xl font-bold text-white">$${ticket.totalPaid ? ticket.totalPaid.toFixed(2) : '0.00'}</span>
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

    <!-- Edit Seats Modal -->
    <div id="editSeatsModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeEditSeatsModal()"></div>
      <div class="relative bg-[#12121a] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="sticky top-0 bg-[#12121a] border-b border-white/10 px-6 py-4 flex justify-between items-center rounded-t-3xl z-10">
          <div>
            <h2 class="text-xl font-bold text-white">Edit Seats</h2>
            <p id="seatModalSubtitle" class="text-white/50 text-sm mt-0.5"></p>
          </div>
          <button onclick="closeEditSeatsModal()" class="p-2 text-white/40 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="px-6 py-5">
          <div id="seatModalError" class="hidden mb-4 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm"></div>
          <div id="seatGridContainer" class="mb-6">
            <div class="text-center text-white/40 py-10">Loading seats...</div>
          </div>
          <div class="flex justify-between items-center border-t border-white/10 pt-5">
            <div class="text-sm text-white/50">
              Selected: <span id="selectedCount" class="font-bold text-white">0</span> / <span id="requiredCount" class="font-bold text-white">0</span> seats
            </div>
            <div class="flex gap-3">
              <button onclick="closeEditSeatsModal()" class="px-5 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
              <button id="updateSeatsBtn" onclick="confirmUpdateSeats()" class="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-500/20 transition-colors disabled:opacity-40" disabled>
                Update Seats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  renderLayout(content);
  bindEditSeatsLogic(token);
}

// ─── Edit Seats Logic ──────────────────────────────────────────────────────
function bindEditSeatsLogic(token) {
  let currentBookingRef = null;
  let selectedSeats = new Set();
  let originalSeats = new Set();
  let requiredCount = 0;

  window.openEditSeatsModal = async function(bookingRef) {
    currentBookingRef = bookingRef;
    selectedSeats = new Set();
    document.getElementById('editSeatsModal').classList.remove('hidden');
    document.getElementById('seatModalError').classList.add('hidden');
    document.getElementById('seatGridContainer').innerHTML = '<div class="text-center text-white/40 py-10">Loading seats...</div>';
    document.getElementById('updateSeatsBtn').disabled = true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingRef}/seats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load seat data');

      const data = await res.json();
      originalSeats = new Set(data.currentSeats || []);
      requiredCount = originalSeats.size;
      selectedSeats = new Set(data.currentSeats || []); // pre-select current seats

      document.getElementById('seatModalSubtitle').textContent = `Booking: ${bookingRef} — Select ${requiredCount} seat(s)`;
      document.getElementById('requiredCount').textContent = requiredCount;
      document.getElementById('selectedCount').textContent = selectedSeats.size;
      document.getElementById('updateSeatsBtn').disabled = selectedSeats.size !== requiredCount;

      document.getElementById('seatGridContainer').innerHTML = buildSeatGrid(
        data.currentSeats || [],
        data.reservedByOthers || [],
        [...selectedSeats]
      );

    } catch (err) {
      showModalError(err.message);
    }
  };

  window.closeEditSeatsModal = function() {
    document.getElementById('editSeatsModal').classList.add('hidden');
    currentBookingRef = null;
    selectedSeats.clear();
  };

  window.toggleSeat = function(seatId) {
    if (selectedSeats.has(seatId)) {
      selectedSeats.delete(seatId);
    } else {
      selectedSeats.add(seatId);
    }
    // Update button visual
    const btn = document.querySelector(`[data-seat="${seatId}"]`);
    if (btn) {
      if (selectedSeats.has(seatId)) {
        btn.className = btn.className.replace(/bg-white\/5|bg-red-600\/40/, 'bg-red-600').replace(/border-white\/10|border-red-500\/40/, 'border-red-500').replace('text-white/60', 'text-white').replace('text-white/70', 'text-white');
      } else {
        btn.className = btn.className.replace('bg-red-600 border-red-500 text-white', 'bg-white/5 border-white/10 hover:bg-white/15 text-white/60');
      }
    }

    document.getElementById('selectedCount').textContent = selectedSeats.size;
    document.getElementById('updateSeatsBtn').disabled = selectedSeats.size !== requiredCount;
  };

  window.confirmUpdateSeats = async function() {
    if (!currentBookingRef) return;

    const btn = document.getElementById('updateSeatsBtn');
    btn.disabled = true;
    btn.textContent = 'Updating...';
    document.getElementById('seatModalError').classList.add('hidden');

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${currentBookingRef}/seats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newSeats: [...selectedSeats] })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || errData || 'Failed to update seats');
      }

      const updated = await res.json();

      // Update the seat badges in the ticket card without full reload
      const seatContainer = document.getElementById(`seats-${currentBookingRef}`);
      if (seatContainer && updated.seats) {
        seatContainer.innerHTML = updated.seats
          .map(s => `<span class="bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-semibold">${s}</span>`)
          .join('');
      }

      closeEditSeatsModal();

    } catch (err) {
      showModalError(err.message);
      btn.disabled = false;
      btn.textContent = 'Update Seats';
    }
  };

  function showModalError(msg) {
    const el = document.getElementById('seatModalError');
    el.textContent = msg;
    el.classList.remove('hidden');
  }
}
