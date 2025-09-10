// UPI Recommendation System JavaScript

// Application data
const appData = {
  userProfiles: {
    "USER_0001": {"avg_amount": 1017, "cluster": 1, "cluster_name": "High-Value Users", "transactions": 8, "preferred_category": "Entertainment"},
    "USER_0002": {"avg_amount": 1004, "cluster": 1, "cluster_name": "High-Value Users", "transactions": 8, "preferred_category": "Healthcare"},
    "USER_0003": {"avg_amount": 850, "cluster": 0, "cluster_name": "Conservative Spenders", "transactions": 6, "preferred_category": "Groceries"},
    "USER_0655": {"avg_amount": 1360, "cluster": 3, "cluster_name": "Active Users", "transactions": 12, "preferred_category": "Food & Dining"},
    "USER_0755": {"avg_amount": 713, "cluster": 2, "cluster_name": "Frequent Small Transactions", "transactions": 15, "preferred_category": "Transportation"}
  },
  categoryAverages: {
    "Food & Dining": 255,
    "Transportation": 118,
    "Shopping": 842,
    "Bills & Utilities": 674,
    "Entertainment": 398,
    "Healthcare": 823,
    "Education": 1987,
    "Groceries": 354,
    "Fuel": 512,
    "Transfer to Friends": 1634
  },
  clusterData: [
    {"cluster": "Conservative Spenders", "users": 162, "avg_amount": 829},
    {"cluster": "High-Value Users", "users": 146, "avg_amount": 1692},
    {"cluster": "Frequent Small Transactions", "users": 227, "avg_amount": 657},
    {"cluster": "Active Users", "users": 267, "avg_amount": 986},
    {"cluster": "Balanced Spenders", "users": 198, "avg_amount": 1208}
  ],
  modelPerformance: [
    {"model": "Random Forest", "mae": 475.68, "rmse": 776.90, "r2": 0.595},
    {"model": "Gradient Boosting", "mae": 478.66, "rmse": 761.18, "r2": 0.611},
    {"model": "Linear Regression", "mae": 786.49, "rmse": 1142.29, "r2": 0.124}
  ]
};

// Chart instances
let charts = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing UPI Recommendation System...');
  initializeNavigation();
  initializeRecommendationForm();
  initializeSliders();
  
  // Initialize charts after a short delay to ensure DOM is ready
  setTimeout(() => {
    initializeCharts();
    updateUserProfile('USER_0001'); // Set default user
  }, 100);
});

// Navigation functionality
function initializeNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.section');

  console.log('Found', navButtons.length, 'navigation buttons');
  console.log('Found', sections.length, 'sections');

  navButtons.forEach((button, index) => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const targetSection = this.getAttribute('data-section');
      console.log('Navigating to:', targetSection);

      // Remove loading state if present
      this.classList.remove('loading');

      // Update active nav button
      navButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('loading');
      });
      this.classList.add('active');

      // Update active section
      sections.forEach(section => {
        section.classList.remove('active');
      });
      
      const targetElement = document.getElementById(targetSection);
      if (targetElement) {
        targetElement.classList.add('active');
        console.log('Section activated:', targetSection);
      } else {
        console.error('Section not found:', targetSection);
      }
    });
  });
}

// Recommendation form functionality
function initializeRecommendationForm() {
  const form = document.getElementById('recommendationForm');
  const userSelect = document.getElementById('userId');
  const resultsDiv = document.getElementById('recommendationResults');

  if (!form || !userSelect || !resultsDiv) {
    console.error('Form elements not found');
    return;
  }

  console.log('Initializing recommendation form...');

  // Update user profile when user changes
  userSelect.addEventListener('change', function(e) {
    console.log('User selected:', this.value);
    updateUserProfile(this.value);
  });

  // Handle form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submitted');

    const userId = document.getElementById('userId').value;
    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const hour = document.getElementById('hour').value;

    console.log('Form data:', { userId, category, location, paymentMethod, hour });

    if (!userId || !category || !location || !paymentMethod) {
      alert('Please fill in all fields');
      return;
    }

    // Remove any loading states
    form.classList.remove('loading');

    // Generate recommendation
    const recommendation = generateRecommendation({
      userId, category, location, paymentMethod, hour
    });

    console.log('Generated recommendation:', recommendation);

    // Display results
    displayRecommendationResults(recommendation);
    resultsDiv.classList.remove('hidden');
  });
}

// Generate mock recommendation based on user data
function generateRecommendation(params) {
  const userProfile = appData.userProfiles[params.userId];
  const categoryAvg = appData.categoryAverages[params.category];
  
  if (!userProfile) {
    return {
      amount: categoryAvg || 500,
      confidence: 75,
      cluster: "Unknown",
      reasoning: "Based on category average and system patterns"
    };
  }

  // Calculate recommendation based on user profile and category
  let baseAmount = userProfile.avg_amount;
  let categoryMultiplier = categoryAvg / 500; // Normalize against average
  let hourMultiplier = 1;
  
  // Adjust for time of day
  const hour = parseInt(params.hour);
  if (hour >= 6 && hour <= 10) {
    hourMultiplier = 0.8; // Morning - smaller amounts
  } else if (hour >= 11 && hour <= 14) {
    hourMultiplier = 1.2; // Lunch - higher amounts
  } else if (hour >= 18 && hour <= 22) {
    hourMultiplier = 1.1; // Evening - moderate increase
  } else {
    hourMultiplier = 0.7; // Late night/early morning - smaller amounts
  }

  const recommendedAmount = Math.round(baseAmount * categoryMultiplier * hourMultiplier);
  
  // Calculate confidence based on user transaction count and category match
  let confidence = 70;
  if (userProfile.preferred_category === params.category) {
    confidence += 20;
  }
  if (userProfile.transactions > 10) {
    confidence += 10;
  }
  confidence = Math.min(confidence, 95);

  return {
    amount: Math.max(recommendedAmount, 50), // Minimum amount
    confidence: confidence,
    cluster: userProfile.cluster_name,
    reasoning: `Based on ${userProfile.cluster_name} spending pattern, ${params.category} preferences, and transaction time analysis`
  };
}

// Display recommendation results
function displayRecommendationResults(recommendation) {
  const amountEl = document.getElementById('recommendedAmount');
  const confidenceEl = document.getElementById('confidence');
  const clusterEl = document.getElementById('userCluster');
  const reasoningEl = document.getElementById('reasoning');

  if (amountEl) amountEl.textContent = recommendation.amount.toLocaleString();
  if (confidenceEl) confidenceEl.textContent = recommendation.confidence;
  if (clusterEl) clusterEl.textContent = recommendation.cluster;
  if (reasoningEl) reasoningEl.textContent = recommendation.reasoning;

  // Update confidence status color
  if (confidenceEl) {
    const confidenceContainer = confidenceEl.parentElement;
    confidenceContainer.className = 'status';
    if (recommendation.confidence >= 85) {
      confidenceContainer.classList.add('status--success');
    } else if (recommendation.confidence >= 70) {
      confidenceContainer.classList.add('status--warning');
    } else {
      confidenceContainer.classList.add('status--error');
    }
  }
}

// Update user profile display
function updateUserProfile(userId) {
  const profile = appData.userProfiles[userId];
  const profileDisplay = document.getElementById('userProfileDisplay');
  
  if (!profileDisplay) {
    console.error('Profile display element not found');
    return;
  }

  if (!profile || !userId) {
    profileDisplay.innerHTML = '<p>Select a user to view profile</p>';
    return;
  }

  console.log('Updating profile for user:', userId, profile);

  profileDisplay.innerHTML = `
    <div class="profile-stat">
      <span class="profile-label">Average Amount:</span>
      <span class="profile-value">₹${profile.avg_amount.toLocaleString()}</span>
    </div>
    <div class="profile-stat">
      <span class="profile-label">Total Transactions:</span>
      <span class="profile-value">${profile.transactions}</span>
    </div>
    <div class="profile-stat">
      <span class="profile-label">Preferred Category:</span>
      <span class="profile-value">${profile.preferred_category}</span>
    </div>
    <div class="profile-stat">
      <span class="profile-label">User Cluster:</span>
      <span class="profile-value status status--info">${profile.cluster_name}</span>
    </div>
  `;

  // Update spending chart
  updateSpendingChart(userId);
}

// Initialize slider functionality
function initializeSliders() {
  const hourSlider = document.getElementById('hour');
  const sliderValue = document.querySelector('.slider-value');

  if (!hourSlider || !sliderValue) {
    console.error('Slider elements not found');
    return;
  }

  console.log('Initializing sliders...');

  // Set initial value
  sliderValue.textContent = hourSlider.value;

  // Update display on slider change
  hourSlider.addEventListener('input', function(e) {
    console.log('Slider changed to:', this.value);
    sliderValue.textContent = this.value;
  });

  // Also handle change event for broader compatibility
  hourSlider.addEventListener('change', function(e) {
    sliderValue.textContent = this.value;
  });
}

// Initialize all charts
function initializeCharts() {
  console.log('Initializing charts...');
  
  try {
    createSpendingChart();
    createPerformanceChart();
    createClusterChart();
    createCategoryChart();
    console.log('All charts initialized successfully');
  } catch (error) {
    console.error('Error initializing charts:', error);
  }
}

// Create spending pattern chart
function createSpendingChart() {
  const ctx = document.getElementById('spendingChart');
  if (!ctx) {
    console.error('Spending chart canvas not found');
    return;
  }

  console.log('Creating spending chart...');
  
  charts.spending = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      datasets: [{
        label: 'Spending Pattern',
        data: [850, 920, 750, 1100, 980, 1050],
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount (₹)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Time Period'
          }
        }
      }
    }
  });
}

// Update spending chart for specific user
function updateSpendingChart(userId) {
  const profile = appData.userProfiles[userId];
  if (!profile || !charts.spending) return;

  console.log('Updating spending chart for user:', userId);

  // Generate mock data based on user profile
  const baseAmount = profile.avg_amount;
  const variation = baseAmount * 0.3;
  const data = [];
  
  for (let i = 0; i < 6; i++) {
    const randomVariation = (Math.random() - 0.5) * variation;
    data.push(Math.round(baseAmount + randomVariation));
  }

  charts.spending.data.datasets[0].data = data;
  charts.spending.update();
}

// Create model performance comparison chart
function createPerformanceChart() {
  const ctx = document.getElementById('performanceChart');
  if (!ctx) {
    console.error('Performance chart canvas not found');
    return;
  }

  console.log('Creating performance chart...');
  
  const labels = appData.modelPerformance.map(model => model.model);
  const maeData = appData.modelPerformance.map(model => model.mae);
  const rmseData = appData.modelPerformance.map(model => model.rmse);

  charts.performance = new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'MAE',
          data: maeData,
          backgroundColor: '#1FB8CD',
          borderColor: '#1FB8CD',
          borderWidth: 1
        },
        {
          label: 'RMSE',
          data: rmseData,
          backgroundColor: '#FFC185',
          borderColor: '#FFC185',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Error Value'
          }
        }
      }
    }
  });
}

// Create user cluster distribution pie chart
function createClusterChart() {
  const ctx = document.getElementById('clusterChart');
  if (!ctx) {
    console.error('Cluster chart canvas not found');
    return;
  }

  console.log('Creating cluster chart...');
  
  const labels = appData.clusterData.map(cluster => cluster.cluster);
  const data = appData.clusterData.map(cluster => cluster.users);
  const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];

  charts.cluster = new Chart(ctx.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderColor: colors.map(color => color),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Create category-wise average amounts chart
function createCategoryChart() {
  const ctx = document.getElementById('categoryChart');
  if (!ctx) {
    console.error('Category chart canvas not found');
    return;
  }

  console.log('Creating category chart...');
  
  const labels = Object.keys(appData.categoryAverages);
  const data = Object.values(appData.categoryAverages);
  const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

  charts.category = new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Average Amount (₹)',
        data: data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount (₹)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Categories'
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
}

// Handle window resize for charts
window.addEventListener('resize', function() {
  Object.values(charts).forEach(chart => {
    if (chart && typeof chart.resize === 'function') {
      chart.resize();
    }
  });
});

console.log('UPI Recommendation System JavaScript loaded successfully');