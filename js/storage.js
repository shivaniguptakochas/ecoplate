/**
 * EcoPlate - LocalStorage Data Engine
 * Manages persistence, retrieval, status transitions, demo data, and impact statistics.
 * Single-browser prototype storage implementation.
 */

const STORAGE_KEY = 'ecoplateListings';

// Helper to format ISO date strings for current demo timestamps
function getRelativeDateString(hoursDelta) {
  const date = new Date(Date.now() + hoursDelta * 60 * 60 * 1000);
  return date.toISOString();
}

// Initial realistic demo dataset for Bennett University campus
const INITIAL_DEMO_LISTINGS = [
  {
    id: 'ep-demo-101',
    foodName: 'Vegetable Biryani & Fresh Raita',
    category: 'Meal',
    quantity: 35,
    unit: 'portions',
    provider: 'Mess 1 (Dining Hall Ground Floor)',
    preparedAt: getRelativeDateString(-2),
    pickupDeadline: getRelativeDateString(3),
    pickupLocation: 'Mess 1 Service Counter B, Central Campus',
    contactPerson: 'Chef Rajesh / Mess Supervisor',
    contactPhone: '+91 98765 43210',
    notes: 'Hot and fresh lunch surplus. Kept in insulated thermal dispensers.',
    status: 'Available',
    reservedBy: null,
    reservedAt: null,
    collectedAt: null,
    isDemo: true,
    createdAt: getRelativeDateString(-2)
  },
  {
    id: 'ep-demo-102',
    foodName: 'Grilled Vegetable Club Sandwiches',
    category: 'Bakery',
    quantity: 20,
    unit: 'portions',
    provider: 'Campus Tuck Shop & Bakery',
    preparedAt: getRelativeDateString(-1.5),
    pickupDeadline: getRelativeDateString(2.5),
    pickupLocation: 'Bakery Kiosk beside Student Activity Center',
    contactPerson: 'Sunil Kumar',
    contactPhone: '+91 98112 33445',
    notes: 'Freshly packed in eco-friendly paper boxes. Veg mayo & cheese.',
    status: 'Available',
    reservedBy: null,
    reservedAt: null,
    collectedAt: null,
    isDemo: true,
    createdAt: getRelativeDateString(-1.5)
  },
  {
    id: 'ep-demo-103',
    foodName: 'Seasonal Fruit Baskets & Bananas',
    category: 'Fruit/Vegetable',
    quantity: 14,
    unit: 'kg',
    provider: 'Mess 2 (North Hostel Wing)',
    preparedAt: getRelativeDateString(-4),
    pickupDeadline: getRelativeDateString(4),
    pickupLocation: 'Mess 2 Storage Dispatch Counter',
    contactPerson: 'Anand Verma',
    contactPhone: '+91 98223 55667',
    notes: 'Whole fresh fruit surplus from breakfast allocation.',
    status: 'Reserved',
    reservedBy: 'Campus Robin Hood Food Drive Volunteer (S26CSEU3117)',
    reservedAt: getRelativeDateString(-1),
    collectedAt: null,
    isDemo: true,
    createdAt: getRelativeDateString(-4)
  },
  {
    id: 'ep-demo-104',
    foodName: 'Tawa Rotis & Dal Makhani Combo',
    category: 'Meal',
    quantity: 45,
    unit: 'meals',
    provider: 'Mess 1 (Dining Hall 1st Floor)',
    preparedAt: getRelativeDateString(-8),
    pickupDeadline: getRelativeDateString(-4),
    pickupLocation: 'Mess 1 Loading Bay',
    contactPerson: 'Dinesh Prasad',
    contactPhone: '+91 98456 77889',
    notes: 'Collected by Night Shift Campus Security & Support Staff.',
    status: 'Collected',
    reservedBy: 'Security Supervisor (Emp #BU441)',
    reservedAt: getRelativeDateString(-6),
    collectedAt: getRelativeDateString(-4.5),
    isDemo: true,
    createdAt: getRelativeDateString(-8)
  },
  {
    id: 'ep-demo-105',
    foodName: 'Whole Wheat Bread Loaves & Rolls',
    category: 'Bakery',
    quantity: 12,
    unit: 'boxes',
    provider: 'Cafeteria C-Block',
    preparedAt: getRelativeDateString(-24),
    pickupDeadline: getRelativeDateString(-12),
    pickupLocation: 'C-Block Pantry 2',
    contactPerson: 'Cafeteria Desk',
    contactPhone: '+91 98990 11223',
    notes: 'Uncollected surplus beyond safe redistribution window.',
    status: 'Expired',
    reservedBy: null,
    reservedAt: null,
    collectedAt: null,
    isDemo: true,
    createdAt: getRelativeDateString(-24)
  }
];

const StorageEngine = {
  /**
   * Initializes local storage with demo items if not already populated.
   */
  init() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      this.resetToDemoData();
    } else {
      // Auto-check and mark past-deadline available items as expired
      this.checkAndApplyExpiration();
    }
  },

  /**
   * Resets local storage back to initial sample demo dataset.
   */
  resetToDemoData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LISTINGS));
    return [...INITIAL_DEMO_LISTINGS];
  },

  /**
   * Clears all listings from local storage.
   */
  clearAll() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  },

  /**
   * Fetches all listings safely.
   */
  getListings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const listings = JSON.parse(raw);
      return Array.isArray(listings) ? listings : [];
    } catch (e) {
      console.error('Failed to parse local storage listings:', e);
      return [];
    }
  },

  /**
   * Finds a single listing by ID.
   */
  getListingById(id) {
    const listings = this.getListings();
    return listings.find(item => item.id === id) || null;
  },

  /**
   * Saves a new surplus food listing.
   */
  addListing(listingData) {
    const listings = this.getListings();
    const newListing = {
      id: 'ep-' + Date.now(),
      foodName: listingData.foodName.trim(),
      category: listingData.category,
      quantity: Number(listingData.quantity),
      unit: listingData.unit,
      provider: listingData.provider.trim(),
      preparedAt: listingData.preparedAt,
      pickupDeadline: listingData.pickupDeadline,
      pickupLocation: listingData.pickupLocation.trim(),
      contactPerson: listingData.contactPerson ? listingData.contactPerson.trim() : 'Mess Representative',
      contactPhone: listingData.contactPhone ? listingData.contactPhone.trim() : '',
      notes: listingData.notes ? listingData.notes.trim() : '',
      status: 'Available',
      reservedBy: null,
      reservedAt: null,
      collectedAt: null,
      isDemo: false,
      createdAt: new Date().toISOString()
    };

    listings.unshift(newListing);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    return newListing;
  },

  /**
   * Updates status of a listing (e.g. Available -> Reserved -> Collected or Expired)
   */
  updateStatus(id, newStatus, meta = {}) {
    const listings = this.getListings();
    const index = listings.findIndex(item => item.id === id);
    if (index === -1) return { success: false, error: 'Listing not found' };

    const item = listings[index];

    // Status transition guards per specification:
    // A listing marked Collected cannot be reserved again
    if (item.status === 'Collected' && newStatus !== 'Collected') {
      return { success: false, error: 'A listing marked Collected cannot be modified again.' };
    }

    // A listing marked Expired should not be reservable
    if (item.status === 'Expired' && newStatus === 'Reserved') {
      return { success: false, error: 'Expired food listings cannot be reserved for safety.' };
    }

    item.status = newStatus;

    if (newStatus === 'Reserved') {
      item.reservedBy = meta.reservedBy || 'Anonymous Campus Member';
      item.reservedAt = new Date().toISOString();
    } else if (newStatus === 'Available') {
      item.reservedBy = null;
      item.reservedAt = null;
    } else if (newStatus === 'Collected') {
      item.collectedAt = new Date().toISOString();
      if (!item.reservedBy && meta.collectedBy) {
        item.reservedBy = meta.collectedBy;
      }
    }

    listings[index] = item;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    return { success: true, listing: item };
  },

  /**
   * Deletes a listing by ID.
   */
  deleteListing(id) {
    let listings = this.getListings();
    listings = listings.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    return true;
  },

  /**
   * Auto-checks deadlines and marks past uncollected listings as Expired.
   */
  checkAndApplyExpiration() {
    const listings = this.getListings();
    const now = new Date().getTime();
    let updated = false;

    for (let item of listings) {
      if (item.status === 'Available' || item.status === 'Reserved') {
        const deadlineTime = new Date(item.pickupDeadline).getTime();
        if (now > deadlineTime) {
          item.status = 'Expired';
          updated = true;
        }
      }
    }

    if (updated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    }
  },

  /**
   * Aggregates metrics and statistics for the Impact Dashboard.
   */
  getDashboardStats() {
    this.checkAndApplyExpiration();
    const listings = this.getListings();

    let totalListings = listings.length;
    let availableCount = 0;
    let reservedCount = 0;
    let collectedCount = 0;
    let expiredCount = 0;

    let totalQuantityListed = 0;
    let totalQuantityCollected = 0;

    // Unit breakdowns
    const quantityByUnit = {};
    const categoryCounts = {};
    const providerCounts = {};

    listings.forEach(item => {
      // Status breakdown
      if (item.status === 'Available') availableCount++;
      else if (item.status === 'Reserved') reservedCount++;
      else if (item.status === 'Collected') collectedCount++;
      else if (item.status === 'Expired') expiredCount++;

      // Quantity aggregation
      const qty = Number(item.quantity) || 0;
      totalQuantityListed += qty;

      if (!quantityByUnit[item.unit]) {
        quantityByUnit[item.unit] = { listed: 0, collected: 0 };
      }
      quantityByUnit[item.unit].listed += qty;

      if (item.status === 'Collected') {
        totalQuantityCollected += qty;
        quantityByUnit[item.unit].collected += qty;
      }

      // Categories
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;

      // Providers
      providerCounts[item.provider] = (providerCounts[item.provider] || 0) + 1;
    });

    const collectionRate = totalQuantityListed > 0 
      ? Math.round((totalQuantityCollected / totalQuantityListed) * 100) 
      : 0;

    return {
      totalListings,
      availableCount,
      reservedCount,
      collectedCount,
      expiredCount,
      totalQuantityListed,
      totalQuantityCollected,
      collectionRate,
      quantityByUnit,
      categoryCounts,
      providerCounts,
      listings
    };
  }
};

// Initialize automatically on script load
StorageEngine.init();

// Export to global scope
window.StorageEngine = StorageEngine;
