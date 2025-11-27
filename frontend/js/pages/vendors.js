// Vendors Page - Full Implementation
let vendorsData = [];

async function loadVendors(container) {
  container.innerHTML = `
    <div class="space-y-8 animate-in">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Vendors</h1>
        <p class="text-gray-600">Manage your vendor contacts</p>
      </div>

      <!-- Add Vendor Form -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          Add New Vendor
        </h2>
        <form id="add-vendor-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
              <input type="text" id="vendor-name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter vendor name">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input type="tel" id="vendor-phone" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter phone number">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select id="vendor-category" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="cement">Cement</option>
                <option value="steel">Steel</option>
                <option value="sand">Sand</option>
                <option value="bricks">Bricks</option>
                <option value="tiles">Tiles</option>
                <option value="paint">Paint</option>
                <option value="electrical">Electrical</option>
                <option value="plumbing">Plumbing</option>
                <option value="hardware">Hardware</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Add Vendor
          </button>
        </form>
      </div>

      <!-- Vendors List -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <h2 class="text-2xl font-bold">Vendors List</h2>
          <div class="flex flex-wrap gap-2">
            <select id="category-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="">All Categories</option>
              <option value="cement">Cement</option>
              <option value="steel">Steel</option>
              <option value="sand">Sand</option>
              <option value="bricks">Bricks</option>
              <option value="tiles">Tiles</option>
              <option value="paint">Paint</option>
              <option value="electrical">Electrical</option>
              <option value="plumbing">Plumbing</option>
              <option value="hardware">Hardware</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div id="vendors-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Vendors will be loaded here -->
        </div>
      </div>
    </div>
  `;

  document.getElementById('add-vendor-form').addEventListener('submit', handleAddVendor);
  document.getElementById('category-filter').addEventListener('change', renderVendors);

  // Set current month/year as default
  const today = new Date();
  document.getElementById('vendors-filter-month').value = today.getMonth();
  document.getElementById('vendors-filter-year').value = today.getFullYear();

  await fetchVendors();
}

async function fetchVendors() {
  const listContainer = document.getElementById('vendors-list');
  showLoading(listContainer);

  try {
    vendorsData = await api.get('/vendors');
    renderVendors();
  } catch (error) {
    listContainer.innerHTML = `<div class="col-span-full text-center text-red-500 p-4">Error loading vendors: ${error.message}</div>`;
  }
}

function renderVendors() {
  const listContainer = document.getElementById('vendors-list');
  const categoryFilter = document.getElementById('category-filter')?.value || '';
  const filterMonth = document.getElementById('vendors-filter-month').value;
  const filterYear = document.getElementById('vendors-filter-year').value;

  let filteredVendors = categoryFilter
    ? vendorsData.filter(v => v.category === categoryFilter)
    : vendorsData;

  if (filterMonth !== '' && filterYear !== '') {
    filteredVendors = filteredVendors.filter(v => {
      const vDate = new Date(v.created_at || v.createdAt);
      return vDate.getMonth() === parseInt(filterMonth) && vDate.getFullYear() === parseInt(filterYear);
    });
  } else if (filterYear !== '') {
    filteredVendors = filteredVendors.filter(v => {
      const vDate = new Date(v.created_at || v.createdAt);
      return vDate.getFullYear() === parseInt(filterYear);
    });
  }

  if (filteredVendors.length === 0) {
    showEmptyState(listContainer, 'No vendors found for this period.');
    return;
  }

  const categoryColors = {
    cement: 'bg-gray-100 text-gray-800',
    steel: 'bg-blue-100 text-blue-800',
    sand: 'bg-yellow-100 text-yellow-800',
    bricks: 'bg-red-100 text-red-800',
    tiles: 'bg-purple-100 text-purple-800',
    paint: 'bg-pink-100 text-pink-800',
    electrical: 'bg-orange-100 text-orange-800',
    plumbing: 'bg-cyan-100 text-cyan-800',
    hardware: 'bg-green-100 text-green-800',
    other: 'bg-gray-100 text-gray-800'
  };

  listContainer.innerHTML = filteredVendors.map(vendor => `
    <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900">${vendor.name}</h3>
          <div class="flex items-center gap-2 mt-2">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span class="text-sm text-gray-600">${vendor.phone}</span>
          </div>
        </div>
        <div class="flex gap-2">
          <button onclick="editVendor('${vendor.id}')" class="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Edit Vendor">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </button>
          <button onclick="deleteVendor('${vendor.id}')" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Vendor">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
      <span class="inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColors[vendor.category] || categoryColors.other}">
        ${vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)}
      </span>
    </div>
  `).join('');
}

let editingVendorId = null;

function editVendor(id) {
  const vendor = vendorsData.find(v => v.id === id);
  if (!vendor) return;

  editingVendorId = id;
  document.getElementById('vendor-name').value = vendor.name;
  document.getElementById('vendor-phone').value = vendor.phone;
  document.getElementById('vendor-category').value = vendor.category;

  const submitBtn = document.querySelector('#add-vendor-form button[type="submit"]');
  submitBtn.textContent = 'Update Vendor';
  submitBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
  submitBtn.classList.add('bg-green-500', 'hover:bg-green-600');

  // Add cancel button if not exists
  if (!document.getElementById('cancel-vendor-edit-btn')) {
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancel-vendor-edit-btn';
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium ml-2';
    cancelBtn.onclick = resetVendorForm;
    submitBtn.parentNode.appendChild(cancelBtn);
  }

  document.getElementById('add-vendor-form').scrollIntoView({ behavior: 'smooth' });
}

function resetVendorForm() {
  editingVendorId = null;
  document.getElementById('add-vendor-form').reset();

  const submitBtn = document.querySelector('#add-vendor-form button[type="submit"]');
  submitBtn.textContent = 'Add Vendor';
  submitBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
  submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600');

  const cancelBtn = document.getElementById('cancel-vendor-edit-btn');
  if (cancelBtn) cancelBtn.remove();
}

async function deleteVendor(id) {
  if (!confirm('Are you sure you want to delete this vendor?')) return;

  try {
    await api.delete(`/vendors/${id}`);
    await fetchVendors();
    showToast('Vendor deleted successfully', 'success');
  } catch (error) {
    showToast('Failed to delete vendor: ' + error.message, 'error');
  }
}

async function handleAddVendor(e) {
  e.preventDefault();

  const name = document.getElementById('vendor-name').value;
  const phone = document.getElementById('vendor-phone').value;
  const category = document.getElementById('vendor-category').value;

  try {
    if (editingVendorId) {
      await api.put(`/vendors/${editingVendorId}`, { name, phone, category });
      showToast('Vendor updated successfully!', 'success');
      resetVendorForm();
    } else {
      await api.post('/vendors', { name, phone, category });
      showToast('Vendor added successfully!', 'success');
      document.getElementById('add-vendor-form').reset();
    }
    await fetchVendors();
  } catch (error) {
    showToast('Failed to save vendor: ' + error.message, 'error');
  }
}
