// Projects Page - Full Implementation
let projectsData = [];

async function loadProjects(container) {
  container.innerHTML = `
    <div class="space-y-8 animate-in">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Projects</h1>
        <p class="text-gray-600">Manage your projects and transactions</p>
      </div>

      <!-- Add Project Form -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
          </svg>
          Add New Project
        </h2>
        <form id="add-project-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
              <input type="text" id="project-name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter project name">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input type="text" id="project-location" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter location">
            </div>
          </div>
          <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Add Project
          </button>
        </form>
      </div>

      <!-- Projects List -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Projects List</h2>
          <div class="flex gap-2">
            <select id="projects-filter-month" class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onchange="renderProjects()">
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
            <select id="projects-filter-year" class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onchange="renderProjects()">
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
          <input type="text" id="projects-search" placeholder="Search by name or location..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div id="projects-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Projects will be loaded here -->
        </div>
      </div>
    </div>
  `;

  document.getElementById('add-project-form').addEventListener('submit', handleAddProject);
  document.getElementById('projects-search').addEventListener('input', renderProjects);

  // Set current month/year as default
  const today = new Date();
  document.getElementById('projects-filter-month').value = today.getMonth();
  document.getElementById('projects-filter-year').value = today.getFullYear();

  await fetchProjects();
}

async function fetchProjects() {
  const listContainer = document.getElementById('projects-list');
  showLoading(listContainer);

  try {
    projectsData = await api.get('/projects');
    renderProjects();
  } catch (error) {
    listContainer.innerHTML = `<div class="col-span-full text-center text-red-500 p-4">Error loading projects: ${error.message}</div>`;
  }
}

function renderProjects() {
  const listContainer = document.getElementById('projects-list');
  if (!listContainer) return;

  const searchQuery = document.getElementById('projects-search')?.value.toLowerCase() || '';
  const filterMonth = document.getElementById('projects-filter-month')?.value || '';
  const filterYear = document.getElementById('projects-filter-year')?.value || '';

  let filteredData = projectsData.filter(p =>
    p.name.toLowerCase().includes(searchQuery) ||
    (p.location && p.location.toLowerCase().includes(searchQuery))
  );

  if (filterMonth !== '' && filterYear !== '') {
    filteredData = projectsData.filter(p => {
      const pDate = new Date(p.created_at || p.createdAt); // Fallback if created_at is missing
      return pDate.getMonth() === parseInt(filterMonth) && pDate.getFullYear() === parseInt(filterYear);
    });
  } else if (filterYear !== '') {
    filteredData = projectsData.filter(p => {
      const pDate = new Date(p.created_at || p.createdAt);
      return pDate.getFullYear() === parseInt(filterYear);
    });
  }

  if (filteredData.length === 0) {
    showEmptyState(listContainer, 'No projects found for this period.');
    return;
  }

  listContainer.innerHTML = filteredData.map(project => {
    const totalBill = project.transactions?.filter(t => t.type === 'bill').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const totalReceived = project.transactions?.filter(t => t.type === 'received').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const balance = totalReceived - totalBill;

    return `
      <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div class="mb-3">
          <h3 class="text-lg font-semibold text-gray-900">${project.name}</h3>
          <p class="text-sm text-gray-600">${project.location}</p>
          <p class="text-xs text-gray-400 mt-1">Created: ${new Date(project.created_at || project.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="space-y-2 mb-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Bill:</span>
            <span class="text-red-600 font-medium">₹${totalBill.toLocaleString()}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Received:</span>
            <span class="text-green-600 font-medium">₹${totalReceived.toLocaleString()}</span>
          </div>
          <div class="flex justify-between text-sm font-bold border-t pt-2">
            <span>Balance:</span>
            <span class="${balance >= 0 ? 'text-green-600' : 'text-red-600'}">₹${balance.toLocaleString()}</span>
          </div>
        </div>
        <div class="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <button onclick="showProjectTransactions('${project.id}')" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
            Manage Transactions
          </button>
          <div class="flex gap-2">
            <button onclick="editProject('${project.id}')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Project">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </button>
            <button onclick="deleteProject('${project.id}')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Project">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

let editingProjectId = null;

function editProject(id) {
  const project = projectsData.find(p => p.id === id);
  if (!project) return;

  editingProjectId = id;
  document.getElementById('project-name').value = project.name;
  document.getElementById('project-location').value = project.location;

  const submitBtn = document.querySelector('#add-project-form button[type="submit"]');
  submitBtn.textContent = 'Update Project';
  submitBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
  submitBtn.classList.add('bg-green-500', 'hover:bg-green-600');

  // Add cancel button if not exists
  if (!document.getElementById('cancel-project-edit-btn')) {
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancel-project-edit-btn';
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium ml-2';
    cancelBtn.onclick = resetProjectForm;
    submitBtn.parentNode.appendChild(cancelBtn);
  }

  document.getElementById('add-project-form').scrollIntoView({ behavior: 'smooth' });
}

function resetProjectForm() {
  editingProjectId = null;
  document.getElementById('add-project-form').reset();

  const submitBtn = document.querySelector('#add-project-form button[type="submit"]');
  submitBtn.textContent = 'Add Project';
  submitBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
  submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600');

  const cancelBtn = document.getElementById('cancel-project-edit-btn');
  if (cancelBtn) cancelBtn.remove();
}

async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project? All associated transactions will also be deleted.')) return;

  try {
    await api.delete(`/projects/${id}`);
    await fetchProjects();
    showToast('Project deleted successfully', 'success');
  } catch (error) {
    showToast('Failed to delete project: ' + error.message, 'error');
  }
}

async function handleAddProject(e) {
  e.preventDefault();

  const name = document.getElementById('project-name').value;
  const location = document.getElementById('project-location').value;

  try {
    if (editingProjectId) {
      await api.put(`/projects/${editingProjectId}`, { name, location });
      showToast('Project updated successfully!', 'success');
      resetProjectForm();
    } else {
      await api.post('/projects', { name, location });
      showToast('Project added successfully!', 'success');
      document.getElementById('add-project-form').reset();
    }
    await fetchProjects();
  } catch (error) {
    showToast('Failed to save project: ' + error.message, 'error');
  }
}

function showProjectTransactions(projectId) {
  const project = projectsData.find(p => p.id === projectId);
  if (!project) return;

  const modalContent = `
    <div class="space-y-4">
      <form id="add-transaction-form-${projectId}" class="space-y-4 border-b pb-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select id="trans-type-${projectId}" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="bill">Bill</option>
              <option value="received">Received</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input type="number" id="trans-amount-${projectId}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Enter amount">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input type="date" id="trans-date-${projectId}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Note</label>
          <input type="text" id="trans-note-${projectId}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Enter note (optional)">
        </div>
        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Add Transaction
        </button>
      </form>

      <div class="space-y-2 max-h-96 overflow-y-auto">
        ${project.transactions && project.transactions.length > 0 ? project.transactions.map(trans => `
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                ${trans.type === 'bill' ?
      '<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>' :
      '<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>'
    }
                <span class="font-medium ${trans.type === 'bill' ? 'text-red-600' : 'text-green-600'}">₹${Number(trans.amount).toLocaleString()}</span>
              </div>
              <p class="text-sm text-gray-600 mt-1">${trans.description || trans.note || 'No note'}</p>
              <p class="text-xs text-gray-400">${new Date(trans.date).toLocaleDateString()}</p>
            </div>
            <div class="flex gap-2 ml-4">
              <button onclick="editProjectTransaction('${projectId}', '${trans.id}')" class="text-blue-500 hover:text-blue-700 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </button>
              <button onclick="deleteProjectTransaction('${projectId}', '${trans.id}')" class="text-red-500 hover:text-red-700 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        `).join('') : '<p class="text-center text-gray-500 py-4">No transactions yet</p>'}
      </div>
    </div>
  `;

  const modal = createModal(`${project.name} - Transactions`, modalContent);
  document.body.appendChild(modal);

  // Set default date to today
  document.getElementById(`trans-date-${projectId}`).valueAsDate = new Date();

  // Attach functions to window so they can be called from onclick
  window.editProjectTransaction = (projId, transId) => {
    const proj = projectsData.find(p => p.id === projId);
    const trans = proj.transactions.find(t => t.id === transId);
    if (!trans) return;

    // Store editing state on the form element itself
    const form = document.getElementById(`add-transaction-form-${projId}`);
    form.dataset.editingId = transId;

    document.getElementById(`trans-type-${projId}`).value = trans.type;
    document.getElementById(`trans-amount-${projId}`).value = trans.amount;
    document.getElementById(`trans-date-${projId}`).value = trans.date;
    document.getElementById(`trans-note-${projId}`).value = trans.description || trans.note || '';

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Update Transaction';
    submitBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
    submitBtn.classList.add('bg-green-500', 'hover:bg-green-600');

    // Add cancel button
    if (!document.getElementById(`cancel-trans-edit-${projId}`)) {
      const cancelBtn = document.createElement('button');
      cancelBtn.id = `cancel-trans-edit-${projId}`;
      cancelBtn.type = 'button';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.className = 'px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors ml-2';
      cancelBtn.onclick = () => {
        delete form.dataset.editingId;
        form.reset();
        document.getElementById(`trans-date-${projId}`).valueAsDate = new Date();
        submitBtn.textContent = 'Add Transaction';
        submitBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
        submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
        cancelBtn.remove();
      };
      submitBtn.parentNode.appendChild(cancelBtn);
    }
  };

  window.deleteProjectTransaction = async (projId, transId) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await api.delete(`/projects/${projId}/transactions/${transId}`);
      await fetchProjects();
      showToast('Transaction deleted', 'success');
      modal.remove();
      showProjectTransactions(projId);
    } catch (error) {
      showToast('Failed to delete transaction: ' + error.message, 'error');
    }
  };

  document.getElementById(`add-transaction-form-${projectId}`).addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const type = document.getElementById(`trans-type-${projectId}`).value;
    const amount = document.getElementById(`trans-amount-${projectId}`).value;
    const date = document.getElementById(`trans-date-${projectId}`).value;
    const note = document.getElementById(`trans-note-${projectId}`).value;
    const editingId = form.dataset.editingId;

    try {
      if (editingId) {
        await api.put(`/projects/${projectId}/transactions/${editingId}`, {
          type,
          amount: parseFloat(amount),
          date,
          description: note || 'Transaction'
        });
        showToast('Transaction updated!', 'success');
      } else {
        await api.post(`/projects/${projectId}/transactions`, {
          type,
          amount: parseFloat(amount),
          date,
          description: note || 'Transaction'
        });
        showToast('Transaction added!', 'success');
      }
      await fetchProjects();
      modal.remove();
      showProjectTransactions(projectId);
    } catch (error) {
      showToast('Failed to save transaction: ' + error.message, 'error');
    }
  });
}
