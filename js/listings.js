/**
 * EcoPlate - Listings Controller
 * Handles filtering, search, rendering of cards, and reservation / collection workflows.
 */

let currentFilter = 'All';
let currentCategory = 'All';
let currentSearch = '';
let currentSort = 'deadline-asc';

// Initialize listings view
function initListingsPage() {
  const gridContainer = document.getElementById('listingsGrid');
  if (!gridContainer) return;

  setupFilterEvents();
  renderListings();
}

// Setup event listeners for search and filters
function setupFilterEvents() {
  const searchInput = document.getElementById('foodSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      renderListings();
    });
  }

  const statusChips = document.querySelectorAll('.chip[data-status]');
  statusChips.forEach(chip => {
    chip.addEventListener('click', () => {
      statusChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-status');
      renderListings();
    });
  });

  const categorySelect = document.getElementById('categoryFilter');
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      renderListings();
    });
  }

  const sortSelect = document.getElementById('sortFilter');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderListings();
    });
  }
}

// Filter and sort listings
function getFilteredListings() {
  let listings = window.StorageEngine.getListings();

  // Auto-expire check before display
  window.StorageEngine.checkAndApplyExpiration();
  listings = window.StorageEngine.getListings();

  // Search filter
  if (currentSearch) {
    listings = listings.filter(item => 
      item.foodName.toLowerCase().includes(currentSearch) ||
      item.provider.toLowerCase().includes(currentSearch) ||
      item.pickupLocation.toLowerCase().includes(currentSearch)
    );
  }

  // Status filter
  if (currentFilter !== 'All') {
    listings = listings.filter(item => item.status === currentFilter);
  }

  // Category filter
  if (currentCategory !== 'All') {
    listings = listings.filter(item => item.category === currentCategory);
  }

  // Sorting
  listings.sort((a, b) => {
    if (currentSort === 'deadline-asc') {
      return new Date(a.pickupDeadline).getTime() - new Date(b.pickupDeadline).getTime();
    } else if (currentSort === 'qty-desc') {
      return Number(b.quantity) - Number(a.quantity);
    } else if (currentSort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return listings;
}

// Render listings into the UI
function renderListings() {
  const container = document.getElementById('listingsGrid');
  if (!container) return;

  const listings = getFilteredListings();

  // Update count indicator if present
  const countDisplay = document.getElementById('resultsCount');
  if (countDisplay) {
    countDisplay.textContent = `${listings.length} item${listings.length === 1 ? '' : 's'} found`;
  }

  if (listings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h3>No surplus food listings match your filter</h3>
        <p>Try clearing your search term, changing status filter, or add a fresh food listing from campus messes.</p>
        <div style="display:flex; justify-content:center; gap: 0.75rem;">
          <button class="btn btn-outline" onclick="resetFilters()">Clear Filters</button>
          <a href="add-listing.html" class="btn btn-primary">+ Add New Listing</a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = listings.map(item => createListingCardHtml(item)).join('');
}

// Create Card HTML
function createListingCardHtml(item) {
  const timeRemaining = window.getTimeRemaining(item.pickupDeadline);
  const statusClass = `badge-${item.status.toLowerCase()}`;
  const categoryIcon = window.getCategoryIcon(item.category);

  return `
    <article class="food-card" id="card-${item.id}">
      <div class="card-top">
        <span class="card-category">
          <span style="width:14px; height:14px; display:inline-block;">${categoryIcon}</span>
          ${item.category}
        </span>
        <div style="display:flex; gap:0.35rem; align-items:center;">
          ${item.isDemo ? '<span class="badge-demo" title="Sample campus demonstration entry">Demo</span>' : ''}
          <span class="badge-status ${statusClass}">${item.status}</span>
        </div>
      </div>

      <h3 class="card-title">${escapeHtml(item.foodName)}</h3>
      
      <div class="card-quantity-badge">
        ${item.quantity} <span class="unit">${escapeHtml(item.unit)}</span>
      </div>

      <ul class="card-info-list">
        <li class="card-info-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          <div><strong>Provider:</strong> ${escapeHtml(item.provider)}</div>
        </li>
        <li class="card-info-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <div><strong>Location:</strong> ${escapeHtml(item.pickupLocation)}</div>
        </li>
        <li class="card-info-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div><strong>Pickup Deadline:</strong> ${window.formatDateTime(item.pickupDeadline)} 
            <span style="color: ${item.status === 'Expired' ? '#dc2626' : '#2d6a4f'}; font-weight:600; font-size:0.75rem;">(${timeRemaining})</span>
          </div>
        </li>
      </ul>

      <div class="card-actions">
        <button class="btn btn-outline btn-sm" onclick="viewListingDetails('${item.id}')">
          View Details
        </button>
        ${item.status === 'Available' ? `
          <button class="btn btn-primary btn-sm" onclick="openReserveModal('${item.id}')">
            Reserve Food
          </button>
        ` : ''}
        ${item.status === 'Reserved' ? `
          <button class="btn btn-solid-dark btn-sm" onclick="openCollectionModal('${item.id}')">
            Mark Collected
          </button>
        ` : ''}
        ${item.status === 'Collected' ? `
          <button class="btn btn-outline btn-sm" style="color:#0369a1; border-color:#bae6fd; background:#e0f2fe; cursor:default;" disabled>
            ✓ Completed
          </button>
        ` : ''}
        ${item.status === 'Expired' ? `
          <button class="btn btn-outline btn-sm" style="color:#991b1b; border-color:#fecaca; background:#fee2e2; cursor:default;" disabled>
            ✕ Expired
          </button>
        ` : ''}
      </div>
    </article>
  `;
}

// View Details Modal
function viewListingDetails(id) {
  const item = window.StorageEngine.getListingById(id);
  if (!item) {
    window.showToast('Listing not found', 'error');
    return;
  }

  const statusClass = `badge-${item.status.toLowerCase()}`;
  const modalHtml = `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; padding-right:2rem;">
        <div>
          <span class="card-category">${item.category}</span>
          ${item.isDemo ? '<span class="badge-demo" style="margin-left:0.4rem;">Demo Data</span>' : ''}
          <h2 class="modal-title" style="margin-top:0.5rem;">${escapeHtml(item.foodName)}</h2>
        </div>
        <span class="badge-status ${statusClass}">${item.status}</span>
      </div>

      <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.25rem;">
        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.25rem;">SURPLUS QUANTITY</div>
        <div style="font-size:1.75rem; font-weight:800; color:var(--primary-800);">${item.quantity} ${escapeHtml(item.unit)}</div>
      </div>

      <div style="margin-bottom:1.5rem;">
        <div class="modal-detail-row">
          <span class="modal-detail-label">Campus Provider / Mess:</span>
          <span class="modal-detail-value">${escapeHtml(item.provider)}</span>
        </div>
        <div class="modal-detail-row">
          <span class="modal-detail-label">Pickup Location:</span>
          <span class="modal-detail-value">${escapeHtml(item.pickupLocation)}</span>
        </div>
        <div class="modal-detail-row">
          <span class="modal-detail-label">Preparation Time:</span>
          <span class="modal-detail-value">${window.formatDateTime(item.preparedAt)}</span>
        </div>
        <div class="modal-detail-row">
          <span class="modal-detail-label">Pickup Deadline:</span>
          <span class="modal-detail-value">${window.formatDateTime(item.pickupDeadline)}</span>
        </div>
        <div class="modal-detail-row">
          <span class="modal-detail-label">Contact Person:</span>
          <span class="modal-detail-value">${escapeHtml(item.contactPerson || 'Campus Representative')}</span>
        </div>
        ${item.contactPhone ? `
        <div class="modal-detail-row">
          <span class="modal-detail-label">Contact Phone:</span>
          <span class="modal-detail-value">${escapeHtml(item.contactPhone)}</span>
        </div>` : ''}
        ${item.reservedBy ? `
        <div class="modal-detail-row" style="background:#fffbeb; padding:0.75rem 0.5rem; border-radius:4px;">
          <span class="modal-detail-label" style="color:#b45309;">Reserved By:</span>
          <span class="modal-detail-value" style="color:#92400e;">${escapeHtml(item.reservedBy)}</span>
        </div>` : ''}
        ${item.collectedAt ? `
        <div class="modal-detail-row" style="background:#eff6ff; padding:0.75rem 0.5rem; border-radius:4px;">
          <span class="modal-detail-label" style="color:#1d4ed8;">Collected On:</span>
          <span class="modal-detail-value" style="color:#1e40af;">${window.formatDateTime(item.collectedAt)}</span>
        </div>` : ''}
      </div>

      ${item.notes ? `
        <div style="background:#f8faf8; border-left:3px solid var(--primary-500); padding:0.85rem 1rem; border-radius:0 var(--radius-sm) var(--radius-sm) 0; font-size:0.9rem; margin-bottom:1.5rem;">
          <strong style="color:var(--primary-900);">Special Notes / Packaging:</strong>
          <p style="color:var(--text-muted); margin-top:0.25rem;">${escapeHtml(item.notes)}</p>
        </div>
      ` : ''}

      <div style="background:#fff5f5; border:1px solid #fed7d7; padding:0.75rem 1rem; border-radius:var(--radius-md); font-size:0.8rem; color:#9b2c2c; margin-bottom:1.5rem;">
        <strong>Campus Food Safety Notice:</strong> Inspect food sensory freshness upon pickup. All campus providers follow standardized hygienic preparation rules.
      </div>

      <div class="modal-actions">
        ${item.status === 'Available' ? `
          <button class="btn btn-primary" onclick="openReserveModal('${item.id}')">Reserve Now</button>
        ` : ''}
        ${item.status === 'Reserved' ? `
          <button class="btn btn-solid-dark" onclick="openCollectionModal('${item.id}')">Confirm Collection</button>
          <button class="btn btn-outline" onclick="cancelReservation('${item.id}')">Cancel Reservation</button>
        ` : ''}
        ${item.status === 'Available' ? `
          <button class="btn btn-outline" onclick="markManualExpired('${item.id}')" title="Manually mark expired for testing">Mark Expired</button>
        ` : ''}
        <button class="btn btn-danger btn-sm" onclick="confirmDeleteListing('${item.id}')" style="flex:0 0 auto;" title="Remove this listing">Delete</button>
      </div>
    </div>
  `;

  window.openModal(modalHtml);
}

// Modal for reserving surplus food
function openReserveModal(id) {
  const item = window.StorageEngine.getListingById(id);
  if (!item) return;

  if (item.status !== 'Available') {
    window.showToast('This item is no longer available to reserve.', 'error');
    return;
  }

  const modalHtml = `
    <div>
      <h2 class="modal-title">Reserve Surplus Food</h2>
      <p style="color:var(--text-muted); font-size:0.925rem; margin-bottom:1.25rem;">
        You are reserving <strong>${item.quantity} ${escapeHtml(item.unit)} of ${escapeHtml(item.foodName)}</strong> from <strong>${escapeHtml(item.provider)}</strong>.
      </p>

      <form id="reserveForm" onsubmit="handleReserveSubmit(event, '${item.id}')">
        <div class="form-group" style="margin-bottom:1rem;">
          <label class="form-label">Recipient Name / Student ID / NGO <span class="required">*</span></label>
          <input type="text" id="reserveNameInput" class="form-input" placeholder="e.g. Robin Hood Army / Student S26CSEU3117" required />
          <span class="field-hint">Used by mess staff to verify recipient upon arrival</span>
        </div>

        <div class="form-group" style="margin-bottom:1.25rem;">
          <label class="form-label">Phone / WhatsApp Number</label>
          <input type="tel" id="reservePhoneInput" class="form-input" placeholder="+91 98765 00000" />
        </div>

        <div class="checkbox-card" style="margin-bottom:1.5rem;">
          <input type="checkbox" id="reserveAgree" required />
          <div class="checkbox-card-content">
            <strong>Timely Pickup Commitment</strong>
            I agree to collect this food before <strong>${window.formatDateTime(item.pickupDeadline)}</strong> at <strong>${escapeHtml(item.pickupLocation)}</strong> to prevent spoilage.
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Confirm Reservation</button>
        </div>
      </form>
    </div>
  `;

  window.openModal(modalHtml);
}

// Handle reservation submission
function handleReserveSubmit(e, id) {
  e.preventDefault();
  const nameInput = document.getElementById('reserveNameInput');
  const recipientName = nameInput ? nameInput.value.trim() : '';

  if (!recipientName) {
    window.showToast('Please enter your recipient name or ID', 'error');
    return;
  }

  const res = window.StorageEngine.updateStatus(id, 'Reserved', { reservedBy: recipientName });
  if (res.success) {
    window.closeModal();
    window.showToast(`Reserved successfully! Pickup deadline: ${window.formatDateTime(res.listing.pickupDeadline)}`, 'success');
    renderListings();
  } else {
    window.showToast(res.error || 'Failed to reserve listing', 'error');
  }
}

// Open modal to mark food as collected
function openCollectionModal(id) {
  const item = window.StorageEngine.getListingById(id);
  if (!item) return;

  const modalHtml = `
    <div>
      <h2 class="modal-title">Confirm Food Collection</h2>
      <p style="color:var(--text-muted); font-size:0.925rem; margin-bottom:1.25rem;">
        Confirm that <strong>${item.quantity} ${escapeHtml(item.unit)} of ${escapeHtml(item.foodName)}</strong> was physically picked up from <strong>${escapeHtml(item.provider)}</strong>.
      </p>

      <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.25rem;">
        <div style="font-size:0.85rem; color:var(--text-muted);">CURRENT STATUS:</div>
        <div style="font-weight:700; color:#b45309;">Reserved by: ${escapeHtml(item.reservedBy || 'Campus Member')}</div>
      </div>

      <div style="margin-bottom:1.5rem; font-size:0.875rem; color:var(--text-muted);">
        Marking this listing as <strong>Collected</strong> will increment campus waste prevention metrics on the Impact Dashboard.
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Back</button>
        <button type="button" class="btn btn-solid-dark" onclick="handleMarkCollected('${item.id}')">Confirm Handover / Collected</button>
      </div>
    </div>
  `;

  window.openModal(modalHtml);
}

function handleMarkCollected(id) {
  const res = window.StorageEngine.updateStatus(id, 'Collected');
  if (res.success) {
    window.closeModal();
    window.showToast('Surplus food marked as Collected! Impact metrics updated.', 'success');
    renderListings();
  } else {
    window.showToast(res.error || 'Unable to update status', 'error');
  }
}

// Cancel reservation back to available
function cancelReservation(id) {
  if (confirm('Cancel reservation and make this surplus food available for others to claim?')) {
    const res = window.StorageEngine.updateStatus(id, 'Available');
    if (res.success) {
      window.closeModal();
      window.showToast('Reservation cancelled. Food is Available again.', 'info');
      renderListings();
    }
  }
}

// Manually mark expired for testing workflow
function markManualExpired(id) {
  if (confirm('Mark this listing as Expired? Expired food will no longer be reservable.')) {
    const res = window.StorageEngine.updateStatus(id, 'Expired');
    if (res.success) {
      window.closeModal();
      window.showToast('Listing marked as Expired.', 'info');
      renderListings();
    }
  }
}

// Delete listing
function confirmDeleteListing(id) {
  if (confirm('Are you sure you want to delete this listing permanently?')) {
    window.StorageEngine.deleteListing(id);
    window.closeModal();
    window.showToast('Listing removed successfully.', 'info');
    renderListings();
  }
}

// Clear all active filters
function resetFilters() {
  currentFilter = 'All';
  currentCategory = 'All';
  currentSearch = '';

  const searchInput = document.getElementById('foodSearchInput');
  if (searchInput) searchInput.value = '';

  const categorySelect = document.getElementById('categoryFilter');
  if (categorySelect) categorySelect.value = 'All';

  const statusChips = document.querySelectorAll('.chip[data-status]');
  statusChips.forEach(chip => {
    chip.classList.toggle('active', chip.getAttribute('data-status') === 'All');
  });

  renderListings();
}

// Utility to escape HTML to prevent XSS
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Auto-run on DOM ready if grid exists
document.addEventListener('DOMContentLoaded', initListingsPage);

// Export for global access
window.initListingsPage = initListingsPage;
window.renderListings = renderListings;
window.viewListingDetails = viewListingDetails;
window.openReserveModal = openReserveModal;
window.openCollectionModal = openCollectionModal;
window.handleReserveSubmit = handleReserveSubmit;
window.handleMarkCollected = handleMarkCollected;
window.cancelReservation = cancelReservation;
window.markManualExpired = markManualExpired;
window.confirmDeleteListing = confirmDeleteListing;
window.resetFilters = resetFilters;
