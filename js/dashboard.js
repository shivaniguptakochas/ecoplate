/**
 * EcoPlate - Impact Dashboard Controller
 * Calculates metrics, renders progress charts, status breakdown, and recent activity log.
 */

function initDashboardPage() {
  const container = document.getElementById('dashboardContent');
  if (!container) return;

  renderDashboardMetrics();
}

function renderDashboardMetrics() {
  const stats = window.StorageEngine.getDashboardStats();

  // 1. Metric Cards
  const totalListingsEl = document.getElementById('metricTotalListings');
  if (totalListingsEl) totalListingsEl.textContent = stats.totalListings;

  const totalListedQtyEl = document.getElementById('metricTotalListedQty');
  if (totalListedQtyEl) totalListedQtyEl.textContent = stats.totalQuantityListed;

  const totalCollectedQtyEl = document.getElementById('metricTotalCollectedQty');
  if (totalCollectedQtyEl) totalCollectedQtyEl.textContent = stats.totalQuantityCollected;

  const collectionRateEl = document.getElementById('metricCollectionRate');
  if (collectionRateEl) collectionRateEl.textContent = `${stats.collectionRate}%`;

  const expiredCountEl = document.getElementById('metricExpiredCount');
  if (expiredCountEl) expiredCountEl.textContent = stats.expiredCount;

  // 2. Status Breakdown Progress Bars
  const statusContainer = document.getElementById('statusBreakdownList');
  if (statusContainer) {
    const total = stats.totalListings || 1; // avoid divide by 0
    const availPct = Math.round((stats.availableCount / total) * 100);
    const resPct = Math.round((stats.reservedCount / total) * 100);
    const collPct = Math.round((stats.collectedCount / total) * 100);
    const expPct = Math.round((stats.expiredCount / total) * 100);

    statusContainer.innerHTML = `
      <div class="progress-item">
        <div class="progress-item-header">
          <span>Available for Pickup</span>
          <span><strong>${stats.availableCount}</strong> (${availPct}%)</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill fill-available" style="width: ${availPct}%"></div>
        </div>
      </div>

      <div class="progress-item">
        <div class="progress-item-header">
          <span>Reserved (Pending Pickup)</span>
          <span><strong>${stats.reservedCount}</strong> (${resPct}%)</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill fill-reserved" style="width: ${resPct}%"></div>
        </div>
      </div>

      <div class="progress-item">
        <div class="progress-item-header">
          <span>Collected (Diverted from Waste)</span>
          <span><strong>${stats.collectedCount}</strong> (${collPct}%)</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill fill-collected" style="width: ${collPct}%"></div>
        </div>
      </div>

      <div class="progress-item">
        <div class="progress-item-header">
          <span>Expired / Uncollected</span>
          <span><strong>${stats.expiredCount}</strong> (${expPct}%)</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill fill-expired" style="width: ${expPct}%"></div>
        </div>
      </div>
    `;
  }

  // 3. Category Distribution
  const categoryContainer = document.getElementById('categoryBreakdownList');
  if (categoryContainer) {
    const categories = Object.keys(stats.categoryCounts);
    if (categories.length === 0) {
      categoryContainer.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem;">No category data yet.</p>';
    } else {
      categoryContainer.innerHTML = categories.map(cat => {
        const count = stats.categoryCounts[cat];
        const pct = Math.round((count / (stats.totalListings || 1)) * 100);
        return `
          <div class="progress-item">
            <div class="progress-item-header">
              <span>${cat}</span>
              <span><strong>${count}</strong> listings (${pct}%)</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: ${pct}%; background: var(--primary-600);"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 4. Provider / Campus Mess Participation
  const providerContainer = document.getElementById('providerBreakdownList');
  if (providerContainer) {
    const providers = Object.keys(stats.providerCounts);
    if (providers.length === 0) {
      providerContainer.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem;">No campus provider data yet.</p>';
    } else {
      providerContainer.innerHTML = providers.map(prov => {
        const count = stats.providerCounts[prov];
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid var(--border-subtle); font-size:0.9rem;">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="width:8px; height:8px; border-radius:50%; background:var(--primary-500);"></span>
              <span>${prov}</span>
            </div>
            <span style="font-weight:700; color:var(--primary-800);">${count} listing${count === 1 ? '' : 's'}</span>
          </div>
        `;
      }).join('');
    }
  }

  // 5. Recent Activity Log Table
  const tableBody = document.getElementById('recentActivityTableBody');
  if (tableBody) {
    const recent = [...stats.listings].slice(0, 8);
    if (recent.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">
            No recorded campus listings yet.
          </td>
        </tr>
      `;
    } else {
      tableBody.innerHTML = recent.map(item => {
        const statusClass = `badge-${item.status.toLowerCase()}`;
        return `
          <tr>
            <td>
              <strong>${item.foodName}</strong>
              ${item.isDemo ? '<span class="badge-demo" style="margin-left:0.35rem;">Demo</span>' : ''}
            </td>
            <td><span class="card-category" style="padding:0.15rem 0.5rem; font-size:0.7rem;">${item.category}</span></td>
            <td><strong>${item.quantity}</strong> ${item.unit}</td>
            <td>${item.provider}</td>
            <td><span class="badge-status ${statusClass}">${item.status}</span></td>
            <td>${window.formatDateTime(item.createdAt)}</td>
          </tr>
        `;
      }).join('');
    }
  }
}

// Auto-run if on dashboard page
document.addEventListener('DOMContentLoaded', initDashboardPage);

// Export for global access
window.initDashboardPage = initDashboardPage;
window.renderDashboardMetrics = renderDashboardMetrics;
