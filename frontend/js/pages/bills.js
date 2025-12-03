// Bills Page - Full Implementation
let billsData = [];

async function loadBills(container) {
  container.innerHTML = `
    <div class="space-y-8 animate-in">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Bills</h1>
        <p class="text-gray-600">Track your expenses and bills</p>
      </div>

      <!-- Add Bill Form -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path>
          </svg>
          Add New Bill
        </h2>
        <form id="add-bill-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Item/Description</label>
              <input type="text" id="bill-item" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter item">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input type="number" id="bill-amount" required step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter amount">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" id="bill-date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
              <input type="text" id="bill-note" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter note">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select id="bill-payment-status" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
          <div id="partial-payment-section" style="display: none;">
            <label class="block text-sm font-medium text-gray-700 mb-2">Amount Paid (for Partial Payment)</label>
            <input type="number" id="bill-amount-paid" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter amount paid">
          </div>
          <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Add Bill
          </button>
        </form>
      </div>

      <!-- Bills List -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Bills List</h2>
          <div class="flex gap-2">
            <select id="bills-filter-month" class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onchange="renderBills()">
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
            <select id="bills-filter-year" class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onchange="renderBills()">
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
        <div id="bills-summary" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Summary will be loaded here -->
        </div>
        <div id="bills-list" class="space-y-3">
          <!-- Bills will be loaded here -->
        </div>
      </div>
    </div>
  `;

  document.getElementById('add-bill-form').addEventListener('submit', handleAddBill);
  document.getElementById('bill-date').valueAsDate = new Date();

  // Show/hide partial payment field based on payment status
  document.getElementById('bill-payment-status').addEventListener('change', function () {
    const partialSection = document.getElementById('partial-payment-section');
    if (this.value === 'partial') {
      partialSection.style.display = 'block';
    } else {
      partialSection.style.display = 'none';
      document.getElementById('bill-amount-paid').value = '';
    }
  });

  // Set current month/year as default
  const today = new Date();
  document.getElementById('bills-filter-month').value = today.getMonth();
  document.getElementById('bills-filter-year').value = today.getFullYear();

  await fetchBills();
}

async function fetchBills() {
  const listContainer = document.getElementById('bills-list');
  showLoading(listContainer);

  try {
    billsData = await api.get('/bills');
    renderBills();
  } catch (error) {
    listContainer.innerHTML = `<div class="text-center text-red-500 p-4">Error loading bills: ${error.message}</div>`;
  }
}

function renderBills() {
  const listContainer = document.getElementById('bills-list');
  if (!listContainer) return;

  const summaryContainer = document.getElementById('bills-summary');
  const filterMonth = document.getElementById('bills-filter-month')?.value || '';
  const filterYear = document.getElementById('bills-filter-year')?.value || '';

  let filteredData = billsData;

  if (filterMonth !== '' && filterYear !== '') {
    filteredData = billsData.filter(b => {
      const bDate = new Date(b.date);
      return bDate.getMonth() === parseInt(filterMonth) && bDate.getFullYear() === parseInt(filterYear);
    });
  } else if (filterYear !== '') {
    filteredData = billsData.filter(b => {
      const bDate = new Date(b.date);
      return bDate.getFullYear() === parseInt(filterYear);
    });
  }

  // Calculate summary based on FILTERED data
  const totalAmount = filteredData.reduce((sum, bill) => sum + Number(bill.amount), 0);
  const totalPaid = filteredData.reduce((sum, bill) => sum + Number(bill.amount_paid || 0), 0);
  const totalPending = totalAmount - totalPaid;

  summaryContainer.innerHTML = `
    <div class="bg-blue-50 rounded-lg p-4">
      <p class="text-sm text-gray-600">Total Bills</p>
      <p class="text-2xl font-bold text-blue-600">${filteredData.length}</p>
    </div>
    <div class="bg-red-50 rounded-lg p-4">
      <p class="text-sm text-gray-600">Total Amount</p>
      <p class="text-2xl font-bold text-red-600">₹${totalAmount.toLocaleString()}</p>
    </div>
    <div class="bg-green-50 rounded-lg p-4">
      <p class="text-sm text-gray-600">Total Paid</p>
      <p class="text-2xl font-bold text-green-600">₹${totalPaid.toLocaleString()}</p>
    </div>
    <div class="bg-orange-50 rounded-lg p-4">
      <p class="text-sm text-gray-600">Pending</p>
      <p class="text-2xl font-bold text-orange-600">₹${totalPending.toLocaleString()}</p>
    </div>
  `;

  if (filteredData.length === 0) {
    showEmptyState(listContainer, 'No bills found for this period.');
    return;
  }

  const getStatusBadge = (status) => {
    const badges = {
      'pending': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">Pending</span>',
      'partial': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Partial</span>',
      'paid': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Paid</span>'
    };
    return badges[status] || badges['pending'];
  };

  listContainer.innerHTML = filteredData.map(bill => {
    const amountPaid = Number(bill.amount_paid || 0);
    const totalAmount = Number(bill.amount);
    const remaining = totalAmount - amountPaid;
    const status = bill.payment_status || 'pending';

    return `
      <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-semibold text-gray-900">${bill.item}</h3>
              ${getStatusBadge(status)}
            </div>
            <p class="text-sm text-gray-600 mt-1">${bill.note || 'No note'}</p>
            <div class="flex items-center gap-4 mt-2">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="text-sm text-gray-500">${new Date(bill.date).toLocaleDateString()}</span>
              </div>
              ${status !== 'pending' ? `
                <div class="text-sm">
                  <span class="text-gray-600">Paid: </span>
                  <span class="font-semibold text-green-600">₹${amountPaid.toLocaleString()}</span>
                </div>
              ` : ''}
              ${status !== 'paid' ? `
                <div class="text-sm">
                  <span class="text-gray-600">Remaining: </span>
                  <span class="font-semibold text-orange-600">₹${remaining.toLocaleString()}</span>
                </div>
              ` : ''}
            </div>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-red-600">₹${totalAmount.toLocaleString()}</p>
            <div class="flex justify-end gap-2 mt-2">
              ${status !== 'paid' ? `
                <button onclick="showPaymentModal('${bill.id}')" class="text-green-500 hover:text-green-700 p-1" title="Add Payment">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </button>
              ` : ''}
              <button onclick="editBill('${bill.id}')" class="text-blue-500 hover:text-blue-700 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </button>
              <button onclick="deleteBill('${bill.id}')" class="text-red-500 hover:text-red-700 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

let editingBillId = null;

function editBill(id) {
  const bill = billsData.find(b => b.id === id);
  if (!bill) return;

  editingBillId = id;
  document.getElementById('bill-item').value = bill.item;
  document.getElementById('bill-amount').value = bill.amount;
  document.getElementById('bill-date').value = bill.date;
  document.getElementById('bill-note').value = bill.note || '';
  document.getElementById('bill-payment-status').value = bill.payment_status || 'pending';

  // Show partial payment field if status is partial
  if (bill.payment_status === 'partial') {
    document.getElementById('partial-payment-section').style.display = 'block';
    document.getElementById('bill-amount-paid').value = bill.amount_paid || 0;
  }

  const submitBtn = document.querySelector('#add-bill-form button[type="submit"]');
  submitBtn.textContent = 'Update Bill';
  submitBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
  submitBtn.classList.add('bg-green-500', 'hover:bg-green-600');

  // Add cancel button if not exists
  if (!document.getElementById('cancel-edit-btn')) {
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancel-edit-btn';
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium ml-2';
    cancelBtn.onclick = resetForm;
    submitBtn.parentNode.appendChild(cancelBtn);
  }

  document.getElementById('add-bill-form').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
  editingBillId = null;
  document.getElementById('add-bill-form').reset();
  document.getElementById('bill-date').valueAsDate = new Date();

  const submitBtn = document.querySelector('#add-bill-form button[type="submit"]');
  submitBtn.textContent = 'Add Bill';
  submitBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
  submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600');

  const cancelBtn = document.getElementById('cancel-edit-btn');
  if (cancelBtn) cancelBtn.remove();
}

async function deleteBill(id) {
  if (!confirm('Are you sure you want to delete this bill?')) return;

  try {
    await api.delete(`/bills/${id}`);
    await fetchBills();
    showToast('Bill deleted successfully', 'success');
  } catch (error) {
    showToast('Failed to delete bill: ' + error.message, 'error');
  }
}

async function handleAddBill(e) {
  e.preventDefault();

  const item = document.getElementById('bill-item').value;
  const amount = parseFloat(document.getElementById('bill-amount').value);
  const date = document.getElementById('bill-date').value;
  const note = document.getElementById('bill-note').value;
  const paymentStatus = document.getElementById('bill-payment-status').value;
  let amountPaid = 0;

  // Handle partial payment
  if (paymentStatus === 'partial') {
    amountPaid = parseFloat(document.getElementById('bill-amount-paid').value) || 0;
    if (amountPaid <= 0 || amountPaid >= amount) {
      showToast('Partial payment must be greater than 0 and less than total amount', 'error');
      return;
    }
  } else if (paymentStatus === 'paid') {
    amountPaid = amount;
  }

  try {
    if (editingBillId) {
      await api.put(`/bills/${editingBillId}`, {
        item, amount, date, note, payment_status: paymentStatus, amount_paid: amountPaid
      });
      showToast('Bill updated successfully!', 'success');
      resetForm();
    } else {
      await api.post('/bills', {
        item, amount, date, note, payment_status: paymentStatus, amount_paid: amountPaid
      });
      showToast('Bill added successfully!', 'success');
      document.getElementById('add-bill-form').reset();
      document.getElementById('bill-date').valueAsDate = new Date();
    }
    await fetchBills();
  } catch (error) {
    showToast('Failed to save bill: ' + error.message, 'error');
  }
}

// Payment Modal Functions
function showPaymentModal(billId) {
  const bill = billsData.find(b => b.id === billId);
  if (!bill) return;

  const remaining = Number(bill.amount) - Number(bill.amount_paid || 0);

  // Create modal
  const modal = document.createElement('div');
  modal.id = 'payment-modal';
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-900">Add Payment</h3>
        <button onclick="closePaymentModal()" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="mb-4">
        <p class="text-sm text-gray-600">Bill: <span class="font-semibold">${bill.item}</span></p>
        <p class="text-sm text-gray-600">Total Amount: <span class="font-semibold text-red-600">₹${Number(bill.amount).toLocaleString()}</span></p>
        <p class="text-sm text-gray-600">Already Paid: <span class="font-semibold text-green-600">₹${Number(bill.amount_paid || 0).toLocaleString()}</span></p>
        <p class="text-sm text-gray-600">Remaining: <span class="font-semibold text-orange-600">₹${remaining.toLocaleString()}</span></p>
      </div>

      <form id="payment-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Payment Amount</label>
          <input type="number" id="payment-amount" required step="0.01" max="${remaining}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter amount">
          <p class="text-xs text-gray-500 mt-1">Maximum: ₹${remaining.toLocaleString()}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
          <input type="text" id="payment-note" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter note">
        </div>
        <div class="flex gap-2">
          <button type="submit" class="flex-1 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
            Add Payment
          </button>
          <button type="button" onclick="closePaymentModal()" class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Handle form submission
  document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await handlePayment(billId);
  });

  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePaymentModal();
  });
}

function closePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) modal.remove();
}

async function handlePayment(billId) {
  const amount = parseFloat(document.getElementById('payment-amount').value);
  const note = document.getElementById('payment-note').value;

  if (amount <= 0) {
    showToast('Payment amount must be greater than 0', 'error');
    return;
  }

  try {
    await api.post(`/bills/${billId}/payment`, { amount, note });
    showToast('Payment added successfully!', 'success');
    closePaymentModal();
    await fetchBills();
  } catch (error) {
    showToast('Failed to add payment: ' + error.message, 'error');
  }
}

