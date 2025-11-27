// Valuation Page - Full Implementation
let valuationsData = [];

async function loadValuation(container) {
  container.innerHTML = `
    <div class="space-y-8 animate-in">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Valuation</h1>
        <p class="text-gray-600">Create and manage valuation reports</p>
      </div>

      <!-- Add Valuation Form -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Create New Valuation
        </h2>
        <form id="add-valuation-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
              <input type="text" id="val-client-name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter client name">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" id="val-date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
              <select id="val-purpose" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="commercial">Commercial</option>
                <option value="residence">Residence</option>
                <option value="agriculture">Agriculture</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Page Count</label>
            <select id="val-page-count" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="1">1 Page</option>
              <option value="3">3 Pages</option>
            </select>
          </div>
          <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Create Valuation
          </button>
        </form>
      </div>

      <!-- Valuations List -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Valuation Records</h2>
          <div class="flex gap-2">
            <select id="val-filter-month" class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onchange="renderValuations()">
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
            <select id="val-filter-year" class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onchange="renderValuations()">
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
        <div id="valuations-list">
          <!-- Valuations will be loaded here -->
        </div>
      </div>
    </div>
  `;

  document.getElementById('add-valuation-form').addEventListener('submit', handleAddValuation);
  document.getElementById('val-date').valueAsDate = new Date();

  // Set current month/year as default
  const today = new Date();
  document.getElementById('val-filter-month').value = today.getMonth();
  document.getElementById('val-filter-year').value = today.getFullYear();

  await fetchValuations();
}

async function fetchValuations() {
  const listContainer = document.getElementById('valuations-list');
  showLoading(listContainer);

  try {
    valuationsData = await api.get('/valuations');
    renderValuations();
  } catch (error) {
    listContainer.innerHTML = `<div class="text-center text-red-500 p-4">Error loading valuations: ${error.message}</div>`;
  }
}

function renderValuations() {
  const listContainer = document.getElementById('valuations-list');
  const filterMonth = document.getElementById('val-filter-month').value;
  const filterYear = document.getElementById('val-filter-year').value;

  let filteredData = valuationsData;

  if (filterMonth !== '' && filterYear !== '') {
    filteredData = valuationsData.filter(val => {
      const valDate = new Date(val.date);
      return valDate.getMonth() === parseInt(filterMonth) && valDate.getFullYear() === parseInt(filterYear);
    });
  } else if (filterYear !== '') {
    filteredData = valuationsData.filter(val => {
      const valDate = new Date(val.date);
      return valDate.getFullYear() === parseInt(filterYear);
    });
  }

  if (filteredData.length === 0) {
    showEmptyState(listContainer, 'No valuations found for this period.');
    return;
  }

  const purposeColors = {
    commercial: 'bg-blue-100 text-blue-800',
    residence: 'bg-green-100 text-green-800',
    agriculture: 'bg-yellow-100 text-yellow-800'
  };

  listContainer.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left p-4 font-medium text-gray-600">Client Name</th>
            <th class="text-left p-4 font-medium text-gray-600">Purpose</th>
            <th class="text-left p-4 font-medium text-gray-600">Pages</th>
            <th class="text-left p-4 font-medium text-gray-600">Date</th>
            <th class="text-left p-4 font-medium text-gray-600">Created</th>
            <th class="text-left p-4 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filteredData.map(val => `
            <tr class="border-t border-gray-200 hover:bg-gray-50 transition-colors">
              <td class="p-4 font-medium text-gray-900">${val.client_name || val.clientName}</td>
              <td class="p-4">
                <span class="inline-block px-3 py-1 rounded-full text-xs font-medium ${purposeColors[val.purpose]}">
                  ${val.purpose.charAt(0).toUpperCase() + val.purpose.slice(1)}
                </span>
              </td>
              <td class="p-4 text-gray-600">${val.page_count || val.pageCount} Page${(val.page_count || val.pageCount) > 1 ? 's' : ''}</td>
              <td class="p-4 text-gray-600">${new Date(val.date).toLocaleDateString()}</td>
              <td class="p-4 text-gray-500 text-sm">${new Date(val.created_at || val.createdAt).toLocaleDateString()}</td>
              <td class="p-4 flex gap-2">
                <button 
                  onclick="openEditor('${val.id}')"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit Report
                </button>
                <button 
                  onclick="generateTemplate('${val.id}', '${val.purpose}')"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-2"
                  title="Download PowerPoint">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </button>
                <button 
                  onclick="deleteValuation('${val.id}')"
                  class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-2"
                  title="Delete Valuation">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function deleteValuation(id) {
  if (!confirm('Are you sure you want to delete this valuation?')) return;

  try {
    await api.delete(`/valuations/${id}`);
    await fetchValuations();
    showToast('Valuation deleted successfully', 'success');
  } catch (error) {
    showToast('Failed to delete valuation: ' + error.message, 'error');
  }
}

async function handleAddValuation(e) {
  e.preventDefault();

  const clientName = document.getElementById('val-client-name').value;
  const date = document.getElementById('val-date').value;
  const purpose = document.getElementById('val-purpose').value;
  const pageCount = parseInt(document.getElementById('val-page-count').value);

  try {
    await api.post('/valuations', {
      client_name: clientName,
      clientName: clientName,
      date,
      purpose,
      page_count: pageCount,
      pageCount: pageCount
    });
    await fetchValuations();
    document.getElementById('add-valuation-form').reset();
    document.getElementById('val-date').valueAsDate = new Date();
    showToast('Valuation created successfully!', 'success');
  } catch (error) {
    showToast('Failed to create valuation: ' + error.message, 'error');
  }
}

async function generateTemplate(valuationId, purpose) {
  try {
    showToast('Generating template...', 'info');

    const response = await api.post(`/valuation-templates/generate/${purpose}?valuation_id=${valuationId}`, {});

    if (response.download_url) {
      const downloadLink = document.createElement('a');
      downloadLink.href = `http://127.0.0.1:8000${response.download_url}`;
      downloadLink.download = response.filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast('Template generated and downloaded successfully!', 'success');
    }
  } catch (error) {
    showToast('Failed to generate template: ' + error.message, 'error');
  }
}

// Editor Functions
async function openEditor(id) {
  const valuation = valuationsData.find(v => v.id === id);
  if (!valuation) return;

  const container = document.getElementById('page-content');

  container.innerHTML = `
    <div class="bg-gray-100 min-h-screen p-8">
      <div class="max-w-4xl mx-auto">
        <!-- Toolbar -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center no-print sticky top-4 z-10">
          <div class="flex items-center gap-4">
            <button onclick="loadValuation(document.getElementById('page-content'))" class="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back
            </button>
            <h1 class="text-xl font-bold">Edit Valuation Report</h1>
          </div>
          <div class="flex gap-3">
            <button onclick="saveReport('${id}')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
              Save
            </button>
            <button onclick="window.print()" class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              Print
            </button>
          </div>
        </div>

        <!-- Report Editor (A4 size approximation) -->
        <div id="valuation-report-container" class="bg-white shadow-lg mx-auto p-12 min-h-[1123px] w-[794px] relative text-gray-900 text-sm leading-relaxed">
          ${renderReportContent(valuation)}
        </div>
      </div>
    </div>
  `;
}

function renderReportContent(val) {
  const data = val.data || {};

  return `
    <div class="text-center mb-8 border-b-2 border-gray-800 pb-4">
      <h1 class="text-3xl font-bold uppercase tracking-wider mb-2">Valuation Report</h1>
      <p class="text-gray-600 font-semibold uppercase">${val.purpose} Property</p>
    </div>

    <div class="grid grid-cols-2 gap-8 mb-8">
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase mb-1 no-print">Ref No</label>
        <input type="text" id="rep-ref" value="${data.ref || `VAL/${new Date().getFullYear()}/${val.id.substr(0, 4).toUpperCase()}`}" class="w-full font-bold border-b border-gray-300 focus:border-blue-500 outline-none">
      </div>
      <div class="text-right">
        <label class="block text-xs font-bold text-gray-500 uppercase mb-1 no-print">Date</label>
        <input type="date" id="rep-date" value="${data.reportDate || val.date}" class="text-right font-bold border-b border-gray-300 focus:border-blue-500 outline-none">
      </div>
    </div>

    <!-- Client Details -->
    <div class="mb-8">
      <h3 class="text-lg font-bold bg-gray-100 p-2 mb-4 border-l-4 border-gray-800 uppercase">1. Client Details</h3>
      <div class="grid grid-cols-[150px_1fr] gap-4 mb-2 items-center">
        <span class="font-bold">Name:</span>
        <input type="text" id="rep-client-name" value="${data.clientName || val.client_name}" class="w-full border-b border-gray-200 focus:border-blue-500 outline-none">
      </div>
      <div class="grid grid-cols-[150px_1fr] gap-4 mb-2 items-start">
        <span class="font-bold">Address:</span>
        <textarea id="rep-client-address" rows="2" class="w-full border-b border-gray-200 focus:border-blue-500 outline-none resize-none">${data.clientAddress || ''}</textarea>
      </div>
    </div>

    <!-- Property Details -->
    <div class="mb-8">
      <h3 class="text-lg font-bold bg-gray-100 p-2 mb-4 border-l-4 border-gray-800 uppercase">2. Property Details</h3>
      <div class="grid grid-cols-[150px_1fr] gap-4 mb-2 items-center">
        <span class="font-bold">Property Type:</span>
        <input type="text" id="rep-prop-type" value="${data.propType || val.purpose}" class="w-full border-b border-gray-200 focus:border-blue-500 outline-none capitalize">
      </div>
      <div class="grid grid-cols-[150px_1fr] gap-4 mb-2 items-start">
        <span class="font-bold">Location:</span>
        <textarea id="rep-prop-location" rows="2" class="w-full border-b border-gray-200 focus:border-blue-500 outline-none resize-none">${data.propLocation || ''}</textarea>
      </div>
      <div class="grid grid-cols-[150px_1fr] gap-4 mb-2 items-center">
        <span class="font-bold">Total Area:</span>
        <input type="text" id="rep-prop-area" value="${data.propArea || ''}" class="w-full border-b border-gray-200 focus:border-blue-500 outline-none" placeholder="e.g. 1200 Sq. Ft.">
      </div>
      <div class="grid grid-cols-[150px_1fr] gap-4 mb-2 items-center">
        <span class="font-bold">Owner Name:</span>
        <input type="text" id="rep-owner" value="${data.owner || ''}" class="w-full border-b border-gray-200 focus:border-blue-500 outline-none">
      </div>
    </div>

    <!-- Valuation Calculation -->
    <div class="mb-8">
      <h3 class="text-lg font-bold bg-gray-100 p-2 mb-4 border-l-4 border-gray-800 uppercase">3. Valuation</h3>
      <table class="w-full mb-4">
        <thead>
          <tr class="border-b-2 border-gray-800">
            <th class="text-left py-2">Description</th>
            <th class="text-right py-2 w-32">Rate</th>
            <th class="text-right py-2 w-32">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="py-2"><input type="text" id="rep-desc-1" value="${data.desc1 || 'Land Value'}" class="w-full outline-none"></td>
            <td class="py-2"><input type="text" id="rep-rate-1" value="${data.rate1 || ''}" class="w-full text-right outline-none" oninput="calculateTotal()"></td>
            <td class="py-2"><input type="text" id="rep-amount-1" value="${data.amount1 || ''}" class="w-full text-right outline-none font-bold" oninput="calculateTotal()"></td>
          </tr>
          <tr>
            <td class="py-2"><input type="text" id="rep-desc-2" value="${data.desc2 || 'Construction Value'}" class="w-full outline-none"></td>
            <td class="py-2"><input type="text" id="rep-rate-2" value="${data.rate2 || ''}" class="w-full text-right outline-none" oninput="calculateTotal()"></td>
            <td class="py-2"><input type="text" id="rep-amount-2" value="${data.amount2 || ''}" class="w-full text-right outline-none font-bold" oninput="calculateTotal()"></td>
          </tr>
          <tr>
            <td class="py-2"><input type="text" id="rep-desc-3" value="${data.desc3 || 'Amenities'}" class="w-full outline-none"></td>
            <td class="py-2"><input type="text" id="rep-rate-3" value="${data.rate3 || ''}" class="w-full text-right outline-none" oninput="calculateTotal()"></td>
            <td class="py-2"><input type="text" id="rep-amount-3" value="${data.amount3 || ''}" class="w-full text-right outline-none font-bold" oninput="calculateTotal()"></td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="border-t-2 border-gray-800">
            <td class="py-2 font-bold text-right" colspan="2">Total Market Value:</td>
            <td class="py-2"><input type="text" id="rep-total" value="${data.total || ''}" class="w-full text-right outline-none font-bold text-lg" readonly></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Remarks -->
    <div class="mb-12">
      <h3 class="text-lg font-bold bg-gray-100 p-2 mb-4 border-l-4 border-gray-800 uppercase">4. Remarks</h3>
      <textarea id="rep-remarks" rows="4" class="w-full border border-gray-200 p-2 focus:border-blue-500 outline-none resize-none rounded">${data.remarks || 'The property is situated in a good residential locality...'}</textarea>
    </div>

    <!-- Signatures -->
    <div class="grid grid-cols-2 gap-12 mt-auto pt-12">
      <div class="text-center">
        <div class="h-20 border-b border-gray-400 mb-2"></div>
        <p class="font-bold">Owner's Signature</p>
      </div>
      <div class="text-center">
        <div class="h-20 border-b border-gray-400 mb-2"></div>
        <p class="font-bold">Valuer's Signature</p>
        <p class="text-xs text-gray-500">Arcnspacedesigns</p>
      </div>
    </div>
  `;
}

async function saveReport(id) {
  const data = {
    ref: document.getElementById('rep-ref').value,
    reportDate: document.getElementById('rep-date').value,
    clientName: document.getElementById('rep-client-name').value,
    clientAddress: document.getElementById('rep-client-address').value,
    propType: document.getElementById('rep-prop-type').value,
    propLocation: document.getElementById('rep-prop-location').value,
    propArea: document.getElementById('rep-prop-area').value,
    owner: document.getElementById('rep-owner').value,
    desc1: document.getElementById('rep-desc-1').value,
    rate1: document.getElementById('rep-rate-1').value,
    amount1: document.getElementById('rep-amount-1').value,
    desc2: document.getElementById('rep-desc-2').value,
    rate2: document.getElementById('rep-rate-2').value,
    amount2: document.getElementById('rep-amount-2').value,
    desc3: document.getElementById('rep-desc-3').value,
    rate3: document.getElementById('rep-rate-3').value,
    amount3: document.getElementById('rep-amount-3').value,
    total: document.getElementById('rep-total').value,
    remarks: document.getElementById('rep-remarks').value
  };

  try {
    // Fetch current valuation to get required fields
    const currentVal = valuationsData.find(v => v.id === id);

    await api.put(`/valuations/${id}`, {
      ...currentVal,
      data: data
    });

    showToast('Report saved successfully!', 'success');
    // Refresh data
    valuationsData = await api.get('/valuations');
  } catch (error) {
    showToast('Failed to save report: ' + error.message, 'error');
  }
}

function calculateTotal() {
  const a1 = parseFloat(document.getElementById('rep-amount-1').value) || 0;
  const a2 = parseFloat(document.getElementById('rep-amount-2').value) || 0;
  const a3 = parseFloat(document.getElementById('rep-amount-3').value) || 0;

  const total = a1 + a2 + a3;
  document.getElementById('rep-total').value = '₹' + total.toLocaleString();
}
