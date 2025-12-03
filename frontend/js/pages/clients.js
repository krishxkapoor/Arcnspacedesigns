// Clients Page
let clientsData = [];

async function loadClients(container) {
  container.innerHTML = `
    <div class="space-y-8 animate-in">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Clients</h1>
        <p class="text-gray-600">Manage client information and documents</p>
      </div>

      <!-- Add Client Form -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          Add New Client
        </h2>
        <form id="add-client-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
              <input type="text" id="client-name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter client name">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input type="text" id="client-address" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter address">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Serial Number (SNO)</label>
              <input type="text" id="client-sno" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter SNO">
            </div>
          </div>
          <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Add Client
          </button>
        </form>
      </div>

      <!-- Client List -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Client List</h2>
          <div class="flex gap-2">
            <select id="clients-filter-month" class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onchange="renderClients()">
              <option value="">All Months</option>
              <option value="0">January</option>
              <option value="1">February</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">June</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">September</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
            </select>
            <select id="clients-filter-year" class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onchange="renderClients()">
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
        <div class="mb-4 relative">
          <svg class="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input type="text" id="client-search" placeholder="Search by name or SNO..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div id="clients-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Clients will be loaded here -->
        </div>
      </div>
    </div>
  `;

  // Set up event listeners
  document.getElementById('add-client-form').addEventListener('submit', handleAddClient);
  document.getElementById('client-search').addEventListener('input', renderClients);

  // Set current month/year as default
  const today = new Date();
  document.getElementById('clients-filter-month').value = today.getMonth();
  document.getElementById('clients-filter-year').value = today.getFullYear();

  // Load clients
  await fetchClients();
}

async function fetchClients() {
  const listContainer = document.getElementById('clients-list');
  showLoading(listContainer);

  try {
    clientsData = await api.get('/clients');
    renderClients();
  } catch (error) {
    listContainer.innerHTML = `<div class="col-span-full text-center text-red-500 p-4">Error loading clients: ${error.message}</div>`;
  }
}

function renderClients() {
  const listContainer = document.getElementById('clients-list');
  if (!listContainer) return;

  const searchQuery = document.getElementById('client-search')?.value.toLowerCase() || '';
  const filterMonth = document.getElementById('clients-filter-month')?.value || '';
  const filterYear = document.getElementById('clients-filter-year')?.value || '';

  let filteredClients = clientsData.filter(client =>
    client.name.toLowerCase().includes(searchQuery) ||
    client.sno.toLowerCase().includes(searchQuery)
  );

  if (filterMonth !== '' && filterYear !== '') {
    filteredClients = filteredClients.filter(c => {
      const cDate = new Date(c.created_at || c.createdAt);
      return cDate.getMonth() === parseInt(filterMonth) && cDate.getFullYear() === parseInt(filterYear);
    });
  } else if (filterYear !== '') {
    filteredClients = filteredClients.filter(c => {
      const cDate = new Date(c.created_at || c.createdAt);
      return cDate.getFullYear() === parseInt(filterYear);
    });
  }

  if (filteredClients.length === 0) {
    showEmptyState(listContainer, 'No clients found for this period.');
    return;
  }

  listContainer.innerHTML = filteredClients.map(client => `
    <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-3">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">${client.name}</h3>
          <p class="text-sm text-gray-600 mt-1">SNO: ${client.sno}</p>
          <p class="text-sm text-gray-600">${client.address}</p>
          <p class="text-xs text-gray-400 mt-1">Created: ${new Date(client.created_at || client.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="flex gap-2">
          <button onclick="showClientFiles('${client.id}')" class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Manage Files">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
            </svg>
          </button>
          <button onclick="editClient('${client.id}')" class="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Edit Client">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </button>
          <button onclick="deleteClient('${client.id}')" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Client">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span>${client.files?.length || 0} file(s)</span>
      </div>
    </div>
  `).join('');
}

let editingClientId = null;

function editClient(id) {
  const client = clientsData.find(c => c.id === id);
  if (!client) return;

  editingClientId = id;
  document.getElementById('client-name').value = client.name;
  document.getElementById('client-address').value = client.address;
  document.getElementById('client-sno').value = client.sno;

  const submitBtn = document.querySelector('#add-client-form button[type="submit"]');
  submitBtn.textContent = 'Update Client';
  submitBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
  submitBtn.classList.add('bg-green-500', 'hover:bg-green-600');

  // Add cancel button if not exists
  if (!document.getElementById('cancel-client-edit-btn')) {
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancel-client-edit-btn';
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium ml-2';
    cancelBtn.onclick = resetClientForm;
    submitBtn.parentNode.appendChild(cancelBtn);
  }

  document.getElementById('add-client-form').scrollIntoView({ behavior: 'smooth' });
}

function resetClientForm() {
  editingClientId = null;
  document.getElementById('add-client-form').reset();

  const submitBtn = document.querySelector('#add-client-form button[type="submit"]');
  submitBtn.textContent = 'Add Client';
  submitBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
  submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600');

  const cancelBtn = document.getElementById('cancel-client-edit-btn');
  if (cancelBtn) cancelBtn.remove();
}

async function deleteClient(id) {
  if (!confirm('Are you sure you want to delete this client? All associated files will also be deleted.')) return;

  try {
    await api.delete(`/clients/${id}`);
    await fetchClients();
    showToast('Client deleted successfully', 'success');
  } catch (error) {
    showToast('Failed to delete client: ' + error.message, 'error');
  }
}

async function handleAddClient(e) {
  e.preventDefault();

  const name = document.getElementById('client-name').value;
  const address = document.getElementById('client-address').value;
  const sno = document.getElementById('client-sno').value;

  try {
    if (editingClientId) {
      await api.put(`/clients/${editingClientId}`, { name, address, sno });
      showToast('Client updated successfully!', 'success');
      resetClientForm();
    } else {
      await api.post('/clients', { name, address, sno });
      showToast('Client added successfully!', 'success');
      document.getElementById('add-client-form').reset();
    }
    await fetchClients();
  } catch (error) {
    showToast('Failed to save client: ' + error.message, 'error');
  }
}

function showClientFiles(clientId) {
  const client = clientsData.find(c => c.id === clientId);
  if (!client) return;

  const modalContent = `
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
        <input type="file" id="file-input-${clientId}" multiple class="w-full px-4 py-2 border border-gray-300 rounded-lg">
        <button onclick="uploadFiles('${clientId}')" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Upload
        </button>
      </div>
      
      <div class="space-y-2 max-h-96 overflow-y-auto">
        ${client.files && client.files.length > 0 ? client.files.map(file => `
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <div>
                <p class="text-sm font-medium">${file.name}</p>
                <p class="text-xs text-gray-500">${new Date(file.uploaded_at).toLocaleDateString()}</p>
              </div>
            </div>
            <button onclick="deleteFile('${clientId}', '${file.id}')" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        `).join('') : '<p class="text-center text-gray-500 py-4">No files uploaded yet</p>'}
      </div>
    </div>
  `;

  const modal = createModal(`${client.name} - Files (${client.files?.length || 0})`, modalContent);
  document.body.appendChild(modal);
}

async function uploadFiles(clientId) {
  const fileInput = document.getElementById(`file-input-${clientId}`);
  const files = fileInput.files;

  if (files.length === 0) {
    showToast('Please select files to upload', 'error');
    return;
  }

  try {
    for (const file of files) {
      await api.post(`/clients/${clientId}/files`, { name: file.name });
    }
    await fetchClients();
    showToast(`${files.length} file(s) added!`, 'success');

    // Close modal and reopen with updated data
    document.querySelector('.fixed.inset-0').remove();
    showClientFiles(clientId);
  } catch (error) {
    showToast('Failed to upload files: ' + error.message, 'error');
  }
}

async function deleteFile(clientId, fileId) {
  if (!confirm('Are you sure you want to delete this file?')) return;

  try {
    await api.delete(`/clients/${clientId}/files/${fileId}`);
    await fetchClients();
    showToast('File deleted successfully', 'success');

    // Close modal and reopen with updated data
    document.querySelector('.fixed.inset-0').remove();
    showClientFiles(clientId);
  } catch (error) {
    showToast('Failed to delete file: ' + error.message, 'error');
  }
}
