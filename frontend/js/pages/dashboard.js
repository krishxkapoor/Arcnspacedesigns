// Dashboard Page
async function loadDashboard(container) {
  container.innerHTML = `
    <div class="space-y-8 animate-in">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">Welcome back! Here's your project overview.</p>
      </div>

      <div id="dashboard-stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <!-- Stats will be loaded here -->
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onclick="window.location.hash='vendors'" class="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Add New Vendor
          </button>
          <button onclick="window.location.hash='clients'" class="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
            Add New Client
          </button>
          <button onclick="window.location.hash='bills'" class="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium">
            Record Expense
          </button>
        </div>
      </div>
    </div>
  `;

  // Load stats
  await loadDashboardStats();
}

async function loadDashboardStats() {
  const statsContainer = document.getElementById('dashboard-stats');
  showLoading(statsContainer);

  try {
    // Fetch all data
    const [clients, vendors, transactions, valuations, projects] = await Promise.all([
      api.get('/clients'),
      api.get('/vendors'),
      api.get('/finance'), // Corrected endpoint
      api.get('/valuations'),
      api.get('/projects')
    ]);

    // Calculate net amount
    const totalCredit = transactions.reduce((sum, t) => sum + Number(t.credit || 0), 0);
    const totalDebit = transactions.reduce((sum, t) => sum + Number(t.debit || 0), 0);
    const netAmount = totalCredit - totalDebit;

    const stats = [
      {
        title: 'Total Clients',
        value: clients.length,
        icon: `<svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>`,
        bgColor: 'bg-blue-50',
        link: '#clients'
      },
      {
        title: 'Net Amount',
        value: `₹${netAmount.toLocaleString()}`,
        icon: `<svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
        </svg>`,
        bgColor: 'bg-green-50',
        link: '#amount'
      },
      {
        title: 'Total Vendors',
        value: vendors.length,
        icon: `<svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>`,
        bgColor: 'bg-purple-50',
        link: '#vendors'
      },
      {
        title: 'Valuations',
        value: valuations.length,
        icon: `<svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>`,
        bgColor: 'bg-yellow-50',
        link: '#valuation'
      },
      {
        title: 'Projects',
        value: projects.length,
        icon: `<svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
        </svg>`,
        bgColor: 'bg-red-50',
        link: '#projects'
      }
    ];

    statsContainer.innerHTML = stats.map(stat => `
      <a href="${stat.link}" class="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">${stat.title}</h3>
          <div class="${stat.bgColor} p-2 rounded-lg">
            ${stat.icon}
          </div>
        </div>
        <div class="text-3xl font-bold text-gray-900">${stat.value}</div>
      </a>
    `).join('');

  } catch (error) {
    statsContainer.innerHTML = `
      <div class="col-span-full text-center text-red-500 p-4">
        Error loading dashboard stats: ${error.message}
      </div>
    `;
  }
}
