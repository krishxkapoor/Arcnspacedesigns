// Amount (Finance) Page - Full Implementation
let transactionsData = [];

async function loadAmount(container) {
  container.innerHTML = `
    <div class="space-y-8 animate-in">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Amount</h1>
        <p class="text-gray-600">Manage financial transactions</p>
      </div>

      <!-- Add Transaction Form -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Add New Transaction
        </h2>
        <form id="add-transaction-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name/Description</label>
              <input type="text" id="trans-name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter name">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Credit (₹)</label>
              <input type="number" id="trans-credit" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="0.00">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Debit (₹)</label>
              <input type="number" id="trans-debit" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="0.00">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" id="trans-date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
            <input type="text" id="trans-note" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter note">
          </div>
          <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Add Transaction
          </button>
        </form>
      </div>

      <!-- Transactions Summary & List -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Transactions</h2>
          <div class="flex gap-2">
            <select id="amount-filter-month" class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onchange="renderTransactions()">
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
            <select id="amount-filter-year" class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onchange="renderTransactions()">
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
        <div id="transactions-summary" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <!-- Summary will be loaded here -->
        </div>
        <div id="transactions-list" class="space-y-3">
          <!-- Transactions will be loaded here -->
        </div>
      </div>
    </div>
  `;

  document.getElementById('add-transaction-form').addEventListener('submit', handleAddTransaction);
  document.getElementById('trans-date').valueAsDate = new Date();

  // Set current month/year as default
  const today = new Date();
  document.getElementById('amount-filter-month').value = today.getMonth();
  document.getElementById('amount-filter-year').value = today.getFullYear();

  // Ensure only one of credit/debit is filled
  const creditInput = document.getElementById('trans-credit');
  const debitInput = document.getElementById('trans-debit');
  creditInput.addEventListener('input', () => { if (creditInput.value) debitInput.value = ''; });
  debitInput.addEventListener('input', () => { if (debitInput.value) creditInput.value = ''; });

  await fetchTransactions();
}

async function fetchTransactions() {
  const listContainer = document.getElementById('transactions-list');
  showLoading(listContainer);

  try {
    transactionsData = await api.get('/finance');
    renderTransactions();
  } catch (error) {
    listContainer.innerHTML = `<div class="text-center text-red-500 p-4">Error loading transactions: ${error.message}</div>`;
  }
}

function renderTransactions() {
  const listContainer = document.getElementById('transactions-list');
  const summaryContainer = document.getElementById('transactions-summary');
  const filterMonth = document.getElementById('amount-filter-month').value;
  const filterYear = document.getElementById('amount-filter-year').value;

  let filteredData = transactionsData;

  if (filterMonth !== '' && filterYear !== '') {
    filteredData = transactionsData.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === parseInt(filterMonth) && tDate.getFullYear() === parseInt(filterYear);
    });
  } else if (filterYear !== '') {
    filteredData = transactionsData.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === parseInt(filterYear);
    });
  }

  // Calculate summary based on FILTERED data
  const totalCredit = filteredData.reduce((sum, t) => sum + Number(t.credit || 0), 0);
  const totalDebit = filteredData.reduce((sum, t) => sum + Number(t.debit || 0), 0);
  const netAmount = totalCredit - totalDebit;

  summaryContainer.innerHTML = `
    <div class="bg-green-50 rounded-lg p-4">
      <p class="text-sm text-gray-600">Total Credit</p>
      <p class="text-2xl font-bold text-green-600">₹${totalCredit.toLocaleString()}</p>
    </div>
    <div class="bg-red-50 rounded-lg p-4">
      <p class="text-sm text-gray-600">Total Debit</p>
      <p class="text-2xl font-bold text-red-600">₹${totalDebit.toLocaleString()}</p>
    </div>
    <div class="bg-blue-50 rounded-lg p-4">
      <p class="text-sm text-gray-600">Net Amount</p>
      <p class="text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}">₹${netAmount.toLocaleString()}</p>
    </div>
  `;

  if (filteredData.length === 0) {
    showEmptyState(listContainer, 'No transactions found for this period.');
    return;
  }

  listContainer.innerHTML = filteredData.map(trans => {
    const isCredit = Number(trans.credit || 0) > 0;
    const amount = isCredit ? trans.credit : trans.debit;

    return `
      <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              ${isCredit ?
        '<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>' :
        '<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>'
      }
              <h3 class="font-semibold text-gray-900">${trans.name}</h3>
            </div>
            <p class="text-sm text-gray-600 mt-1">${trans.note || 'No note'}</p>
            <div class="flex items-center gap-2 mt-2">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span class="text-sm text-gray-500">${new Date(trans.date).toLocaleDateString()}</span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold ${isCredit ? 'text-green-600' : 'text-red-600'}">
              ${isCredit ? '+' : '-'}₹${Number(amount).toLocaleString()}
            </p>
            <p class="text-xs text-gray-500">${isCredit ? 'Credit' : 'Debit'}</p>
            <div class="flex justify-end gap-2 mt-2">
              <button onclick="editTransaction('${trans.id}')" class="text-blue-500 hover:text-blue-700 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </button>
              <button onclick="deleteTransaction('${trans.id}')" class="text-red-500 hover:text-red-700 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

let editingTransactionId = null;

function editTransaction(id) {
  const trans = transactionsData.find(t => t.id === id);
  if (!trans) return;

  editingTransactionId = id;
  document.getElementById('trans-name').value = trans.name;
  document.getElementById('trans-credit').value = trans.credit || '';
  document.getElementById('trans-debit').value = trans.debit || '';
  document.getElementById('trans-date').value = trans.date;
  document.getElementById('trans-note').value = trans.note || '';

  const submitBtn = document.querySelector('#add-transaction-form button[type="submit"]');
  submitBtn.textContent = 'Update Transaction';
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

  document.getElementById('add-transaction-form').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
  editingTransactionId = null;
  document.getElementById('add-transaction-form').reset();
  document.getElementById('trans-date').valueAsDate = new Date();

  const submitBtn = document.querySelector('#add-transaction-form button[type="submit"]');
  submitBtn.textContent = 'Add Transaction';
  submitBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
  submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600');

  const cancelBtn = document.getElementById('cancel-edit-btn');
  if (cancelBtn) cancelBtn.remove();
}

async function deleteTransaction(id) {
  if (!confirm('Are you sure you want to delete this transaction?')) return;

  try {
    await api.delete(`/finance/${id}`);
    await fetchTransactions();
    showToast('Transaction deleted successfully', 'success');
  } catch (error) {
    showToast('Failed to delete transaction: ' + error.message, 'error');
  }
}

async function handleAddTransaction(e) {
  e.preventDefault();

  const name = document.getElementById('trans-name').value;
  const credit = parseFloat(document.getElementById('trans-credit').value) || 0;
  const debit = parseFloat(document.getElementById('trans-debit').value) || 0;
  const date = document.getElementById('trans-date').value;
  const note = document.getElementById('trans-note').value;

  if (credit === 0 && debit === 0) {
    showToast('Please enter either credit or debit amount', 'error');
    return;
  }

  try {
    if (editingTransactionId) {
      await api.put(`/finance/${editingTransactionId}`, { name, credit, debit, date, note });
      showToast('Transaction updated successfully!', 'success');
      resetForm();
    } else {
      await api.post('/finance', { name, credit, debit, date, note });
      showToast('Transaction added successfully!', 'success');
      document.getElementById('add-transaction-form').reset();
      document.getElementById('trans-date').valueAsDate = new Date();
    }
    await fetchTransactions();
  } catch (error) {
    showToast('Failed to save transaction: ' + error.message, 'error');
  }
}
