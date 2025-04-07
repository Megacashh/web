document.addEventListener('DOMContentLoaded', function() {
  // Variables de estado
  let selectedNumbers = [];
  let selectedExtraNumber = null;
  let userBalance = 0;
  let isLoggedIn = false;
  let isAdmin = false;
  
  // Datos persistentes (simulando una base de datos)
  let users = JSON.parse(localStorage.getItem('megacash_users')) || [
    { id: 1, email: 'megacashh096@gmail.com', password: 'Walter123456', balance: 0, isAdmin: true, name: 'Walter Guevara' }
  ];
  let rechargeRequests = JSON.parse(localStorage.getItem('megacash_recharges')) || [];
  let lotteryResults = JSON.parse(localStorage.getItem('megacash_results')) || [
    { date: '2023-05-15', numbers: [5, 12, 23, 34, 45], extra: 7, prize: '$3,000,000' },
    { date: '2023-05-08', numbers: [3, 18, 22, 31, 44], extra: 12, prize: '$1,000,000' },
    { date: '2023-05-01', numbers: [7, 14, 25, 33, 42], extra: 5, prize: '$800' }
  ];

  // Elementos del DOM
  const numberGrid = document.getElementById('number-grid');
  const extraNumberGrid = document.getElementById('extra-number-grid');
  const currentBalance = document.getElementById('current-balance');
  const playBtn = document.getElementById('play-btn');
  const randomBtn = document.getElementById('random-btn');
  const clearBtn = document.getElementById('clear-btn');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const loginModal = document.getElementById('login-modal');
  const registerModal = document.getElementById('register-modal');
  const closeModalButtons = document.querySelectorAll('.close-modal');
  const authButtons = document.getElementById('auth-buttons');
  const userPanel = document.getElementById('user-panel');
  const userGreeting = document.getElementById('user-greeting');
  const adminPanel = document.getElementById('admin-panel');
  
  // Elementos de navegación
  const navHome = document.getElementById('nav-home');
  const navPlay = document.getElementById('nav-play');
  const navResults = document.getElementById('nav-results');
  const navRecharge = document.getElementById('nav-recharge');
  
  // Secciones
  const homeSection = document.getElementById('home-section');
  const playSection = document.getElementById('play-section');
  const resultsSection = document.getElementById('results-section');
  const rechargeSection = document.getElementById('recharge-section');

  // Función para guardar datos en localStorage
  function saveData() {
    localStorage.setItem('megacash_users', JSON.stringify(users));
    localStorage.setItem('megacash_recharges', JSON.stringify(rechargeRequests));
    localStorage.setItem('megacash_results', JSON.stringify(lotteryResults));
  }

  // Inicializar la cuadrícula de números
  function initNumberGrid() {
    if (!numberGrid || !extraNumberGrid) return;
    
    // Limpiar cuadrículas
    numberGrid.innerHTML = '';
    extraNumberGrid.innerHTML = '';
    
    // Números principales (1-45)
    for (let i = 1; i <= 45; i++) {
      const numberElement = document.createElement('div');
      numberElement.className = 'number-circle';
      numberElement.textContent = i;
      numberElement.addEventListener('click', () => selectNumber(i, false));
      numberGrid.appendChild(numberElement);
    }
    
    // Números extras (1-20) - Todos visibles
    for (let i = 1; i <= 20; i++) {
      const extraNumberElement = document.createElement('div');
      extraNumberElement.className = `number-circle extra ${selectedExtraNumber === i ? 'selected' : ''}`;
      extraNumberElement.textContent = i;
      extraNumberElement.addEventListener('click', () => selectNumber(i, true));
      extraNumberGrid.appendChild(extraNumberElement);
    }
  }

  // Seleccionar número
  function selectNumber(num, isExtra) {
    if (isExtra) {
      // Deseleccionar cualquier número extra previo
      document.querySelectorAll('.number-circle.extra').forEach(el => {
        el.classList.remove('selected');
      });
      
      selectedExtraNumber = num;
      
      // Seleccionar el nuevo número extra
      const extraElements = document.querySelectorAll('.number-circle.extra');
      extraElements.forEach(el => {
        if (parseInt(el.textContent) === num) {
          el.classList.add('selected');
        }
      });
    } else {
      const index = selectedNumbers.indexOf(num);
      const numberElement = Array.from(document.querySelectorAll('.number-circle'))
        .find(el => el.textContent == num && !el.classList.contains('extra'));

      if (index === -1) {
        if (selectedNumbers.length >= 5) return;
        selectedNumbers.push(num);
        if (numberElement) numberElement.classList.add('selected');
      } else {
        selectedNumbers.splice(index, 1);
        if (numberElement) numberElement.classList.remove('selected');
      }
    }

    updatePlayButton();
  }

  // Actualizar estado del botón de jugar
  function updatePlayButton() {
    if (playBtn) {
      playBtn.disabled = !(selectedNumbers.length === 5 && selectedExtraNumber !== null);
    }
  }

  // Generar números aleatorios
  function generateRandomNumbers() {
    // Limpiar selección
    selectedNumbers = [];
    selectedExtraNumber = null;
    document.querySelectorAll('.number-circle').forEach(el => {
      el.classList.remove('selected');
    });

    // Seleccionar 5 números únicos entre 1-45
    while (selectedNumbers.length < 5) {
      const randomNum = Math.floor(Math.random() * 45) + 1;
      if (!selectedNumbers.includes(randomNum)) {
        selectedNumbers.push(randomNum);
        const numberElement = Array.from(document.querySelectorAll('.number-circle'))
          .find(el => el.textContent == randomNum);
        if (numberElement) numberElement.classList.add('selected');
      }
    }

    // Seleccionar 1 número extra entre 1-20
    selectedExtraNumber = Math.floor(Math.random() * 20) + 1;
    const extraElements = document.querySelectorAll('.number-circle.extra');
    extraElements.forEach(el => {
      if (parseInt(el.textContent) === selectedExtraNumber) {
        el.classList.add('selected');
      }
    });

    updatePlayButton();
  }

  // Limpiar selección
  function clearSelection() {
    selectedNumbers = [];
    selectedExtraNumber = null;
    document.querySelectorAll('.number-circle').forEach(el => {
      el.classList.remove('selected');
    });
    updatePlayButton();
  }

  // Ocultar todas las secciones
  function hideAllSections() {
    if (homeSection) homeSection.style.display = 'none';
    if (playSection) playSection.style.display = 'none';
    if (resultsSection) resultsSection.style.display = 'none';
    if (rechargeSection) rechargeSection.style.display = 'none';
  }

  // Remover clase active de todos los botones de navegación
  function removeActiveClass() {
    if (navHome) navHome.classList.remove('active');
    if (navPlay) navPlay.classList.remove('active');
    if (navResults) navResults.classList.remove('active');
    if (navRecharge) navRecharge.classList.remove('active');
  }

  // Manejar navegación entre secciones
  function setupNavigation() {
    if (navHome) {
      navHome.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        removeActiveClass();
        if (homeSection) homeSection.style.display = 'block';
        if (navHome) navHome.classList.add('active');
      });
    }

    if (navPlay) {
      navPlay.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        removeActiveClass();
        if (playSection) playSection.style.display = 'block';
        if (navPlay) navPlay.classList.add('active');
      });
    }

    if (navResults) {
      navResults.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        removeActiveClass();
        if (resultsSection) resultsSection.style.display = 'block';
        if (navResults) navResults.classList.add('active');
        loadResultsSection();
      });
    }

    if (navRecharge) {
      navRecharge.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        removeActiveClass();
        if (rechargeSection) rechargeSection.style.display = 'block';
        if (navRecharge) navRecharge.classList.add('active');
        loadRechargeSection();
      });
    }
  }

  // Cargar sección de resultados
  function loadResultsSection() {
    if (!resultsSection) return;
    
    const resultsBody = document.getElementById('results-body');
    if (!resultsBody) return;
    
    resultsBody.innerHTML = '';
    
    // Mostrar resultados almacenados
    lotteryResults.forEach(result => {
      addResultToTable(result.date, result.numbers, result.extra, result.prize);
    });
    
    // Si es admin, agregar controles
    if (isAdmin) {
      const resultsContainer = document.querySelector('.results-container');
      if (!resultsContainer) return;
      
      const existingControls = document.querySelector('.admin-panel-content');
      
      if (!existingControls) {
        resultsContainer.insertAdjacentHTML('afterbegin', getAdminControlsHTML());
        setupAdminControls();
      }
    } else {
      // Eliminar controles de admin si existen
      const adminControls = document.querySelector('.admin-panel-content');
      if (adminControls) adminControls.remove();
    }
  }

  function getAdminControlsHTML() {
    return `
    <div class="admin-panel-content">
      <h3><i class="fas fa-user-shield"></i> Panel de Administración</h3>
      
      <div class="admin-tabs">
        <button class="admin-tab active" data-tab="users">Usuarios</button>
        <button class="admin-tab" data-tab="recharges">Recargas</button>
        <button class="admin-tab" data-tab="results">Resultados</button>
        <button class="admin-tab" data-tab="tickets">Tickets Jugados</button>
      </div>
      
      <div id="admin-users-tab" class="admin-tab-content active">
        <h4>Usuarios Registrados</h4>
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Nombre</th>
              <th>Saldo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="admin-users-list">
            <!-- Usuarios se cargarán aquí -->
          </tbody>
        </table>
      </div>
      
      <div id="admin-recharges-tab" class="admin-tab-content">
        <h4>Solicitudes de Recarga</h4>
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="admin-recharges-list">
            <!-- Solicitudes se cargarán aquí -->
          </tbody>
        </table>
      </div>
      
      <div id="admin-results-tab" class="admin-tab-content">
        <div class="admin-results-controls">
          <div class="admin-actions">
            <button id="manual-results-btn" class="btn btn-admin"><i class="fas fa-edit"></i> Modificación Manual</button>
            <button id="auto-results-btn" class="btn btn-secondary"><i class="fas fa-sync-alt"></i> Obtener Automáticamente</button>
          </div>
          <div id="manual-results-form" style="display: none;">
            <div class="form-group">
              <label for="result-date">Fecha del sorteo:</label>
              <input type="date" id="result-date" required>
            </div>
            <div class="number-selector">
              <h4>Seleccione 5 números principales (1-45):</h4>
              <div class="number-grid" id="admin-main-numbers"></div>
            </div>
            <div class="number-selector">
              <h4>Seleccione 1 número extra (1-20):</h4>
              <div class="number-grid" id="admin-extra-number"></div>
            </div>
            <button id="save-results-btn" class="btn btn-primary"><i class="fas fa-save"></i> Guardar Resultados</button>
          </div>
        </div>
      </div>
      
      <div id="admin-tickets-tab" class="admin-tab-content">
        <h4>Tickets Jugados Recientemente</h4>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Números</th>
              <th>Extra</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody id="admin-tickets-list">
            <!-- Tickets se cargarán aquí -->
          </tbody>
        </table>
      </div>
    </div>
    `;
  }

  // Cargar sección de recarga
  function loadRechargeSection() {
    const rechargeContainer = document.getElementById('recharge-container');
    if (!rechargeContainer) return;
    
    rechargeContainer.innerHTML = `
      <div class="recharge-section">
        <h2><i class="fas fa-coins"></i> Recarga tu Saldo</h2>
        <div class="balance-info">
          <p>Saldo actual: <span id="current-balance-recharge">$${userBalance.toLocaleString()}</span></p>
        </div>
        
        <div class="recharge-options">
          <h3>Seleccione el monto:</h3>
          <div class="amount-buttons">
            <button class="amount-btn" data-amount="10000">$10,000</button>
            <button class="amount-btn" data-amount="20000">$20,000</button>
            <button class="amount-btn" data-amount="50000">$50,000</button>
            <button class="amount-btn" data-amount="100000">$100,000</button>
          </div>
          
          <div class="custom-amount">
            <label for="custom-amount">O ingrese un monto personalizado:</label>
            <input type="number" id="custom-amount" min="10000" step="1000" placeholder="Mínimo $10,000">
          </div>
        </div>
        
        <div class="recharge-instructions">
          <h3>Instrucciones para recargar:</h3>
          <ol>
            <li>Seleccione el monto que desea recargar</li>
            <li>Realice una transferencia o depósito a la cuenta bancaria que se muestra</li>
            <li>Envíe el comprobante al correo: megacashh096@gmail.com</li>
            <li>Espere la confirmación del administrador</li>
          </ol>
          
          <div class="bank-info">
            <h4>Información Bancaria:</h4>
            <p><strong>Banco:</strong> PayPal</p>
            <p><strong>Tipo de cuenta:</strong> Billetera Digital</p>
            <p><strong>Número de cuenta:</strong> megacashh096@gmail.com</p>
            <p><strong>Titular:</strong> Héctor Villa</p>
          </div>
        </div>
        
        <button id="send-recharge-btn" class="btn btn-primary">
          <i class="fas fa-paper-plane"></i> Enviar Solicitud de Recarga
        </button>
      </div>
    `;
    
    // Configurar eventos de los botones de monto
    document.querySelectorAll('.amount-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        // Remover selección de todos los botones
        document.querySelectorAll('.amount-btn').forEach(b => {
          b.classList.remove('selected');
        });
        
        // Seleccionar este botón
        this.classList.add('selected');
        
        // Establecer el monto personalizado
        const customAmount = document.getElementById('custom-amount');
        if (customAmount) {
          customAmount.value = this.getAttribute('data-amount');
        }
      });
    });
    
    // Configurar evento del botón de enviar
    const sendRechargeBtn = document.getElementById('send-recharge-btn');
    if (sendRechargeBtn) {
      sendRechargeBtn.addEventListener('click', sendRechargeRequest);
    }
  }

  // Configurar controles de admin
  function setupAdminControls() {
    // Configurar tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Remover active de todos
        document.querySelectorAll('.admin-tab, .admin-tab-content').forEach(el => {
          el.classList.remove('active');
        });
        
        // Agregar active a los seleccionados
        this.classList.add('active');
        const tabContent = document.getElementById(`admin-${tabId}-tab`);
        if (tabContent) tabContent.classList.add('active');
        
        // Cargar datos según la pestaña
        if (tabId === 'users') {
          loadAdminUsers();
        } else if (tabId === 'recharges') {
          loadRechargeRequests();
        } else if (tabId === 'tickets') {
          loadPlayedTickets();
        }
      });
    });
    
    // Cargar usuarios inicialmente
    loadAdminUsers();
    
    // Configurar controles de resultados
    const manualResultsBtn = document.getElementById('manual-results-btn');
    const autoResultsBtn = document.getElementById('auto-results-btn');
    const manualResultsForm = document.getElementById('manual-results-form');
    const saveResultsBtn = document.getElementById('save-results-btn');

    if (manualResultsBtn && manualResultsForm) {
      manualResultsBtn.addEventListener('click', () => {
        manualResultsForm.style.display = 'block';
        initAdminNumberGrids();
      });
    }

    if (autoResultsBtn) {
      autoResultsBtn.addEventListener('click', fetchBalotoResults);
    }

    if (saveResultsBtn) {
      saveResultsBtn.addEventListener('click', saveManualResults);
    }
  }

  // Nueva función para cargar tickets jugados
  function loadPlayedTickets() {
    const ticketsList = document.getElementById('admin-tickets-list');
    if (!ticketsList) return;
    
    ticketsList.innerHTML = '';
    
    // Obtener todos los tickets jugados (simulado)
    const playedTickets = JSON.parse(localStorage.getItem('megacash_tickets')) || [];
    
    playedTickets.forEach(ticket => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${ticket.userEmail}</td>
        <td>${ticket.numbers.join(', ')}</td>
        <td>${ticket.extra}</td>
        <td>${ticket.date}</td>
      `;
      ticketsList.appendChild(row);
    });
  }

  // Inicializar grids de números para admin
  function initAdminNumberGrids() {
    const mainGrid = document.getElementById('admin-main-numbers');
    const extraGrid = document.getElementById('admin-extra-number');
    
    if (!mainGrid || !extraGrid) return;
    
    mainGrid.innerHTML = '';
    extraGrid.innerHTML = '';
    
    // Números principales (1-45)
    for (let i = 1; i <= 45; i++) {
      const numElement = document.createElement('div');
      numElement.className = 'number-circle';
      numElement.textContent = i;
      numElement.addEventListener('click', function() {
        const selected = document.querySelectorAll('#admin-main-numbers .selected');
        if (this.classList.contains('selected') || selected.length < 5) {
          this.classList.toggle('selected');
        }
      });
      mainGrid.appendChild(numElement);
    }
    
    // Número extra (1-20)
    for (let i = 1; i <= 20; i++) {
      const numElement = document.createElement('div');
      numElement.className = 'number-circle extra';
      numElement.textContent = i;
      numElement.addEventListener('click', function() {
        document.querySelectorAll('#admin-extra-number .selected').forEach(el => {
          el.classList.remove('selected');
        });
        this.classList.add('selected');
      });
      extraGrid.appendChild(numElement);
    }
  }

  // Cargar usuarios en panel admin
  function loadAdminUsers() {
    const usersList = document.getElementById('admin-users-list');
    if (!usersList) return;
    
    usersList.innerHTML = '';
    
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.email}</td>
        <td>${user.name || 'Usuario'}</td>
        <td>$${user.balance.toLocaleString()}</td>
        <td>
          <button class="btn btn-sm btn-recharge" data-user-id="${user.id}">
            <i class="fas fa-coins"></i> Recargar
          </button>
          ${user.isAdmin ? '' : `
          <button class="btn btn-sm btn-danger btn-delete-user" data-user-id="${user.id}">
            <i class="fas fa-trash"></i> Eliminar
          </button>
          `}
        </td>
      `;
      usersList.appendChild(row);
    });
    
    // Configurar eventos de recarga
    document.querySelectorAll('.btn-recharge').forEach(btn => {
      btn.addEventListener('click', function() {
        const userId = parseInt(this.getAttribute('data-user-id'));
        showRechargeModal(userId);
      });
    });
    
    // Configurar eventos de eliminar usuario
    document.querySelectorAll('.btn-delete-user').forEach(btn => {
      btn.addEventListener('click', function() {
        const userId = parseInt(this.getAttribute('data-user-id'));
        if (confirm(`¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.`)) {
          deleteUser(userId);
        }
      });
    });
  }

  // Nueva función para eliminar usuario
  function deleteUser(userId) {
    // No permitir eliminar al admin principal
    if (userId === 1) {
      alert('No se puede eliminar al administrador principal');
      return;
    }
    
    users = users.filter(user => user.id !== userId);
    saveData();
    loadAdminUsers();
    alert('Usuario eliminado correctamente');
  }

  // Mostrar modal de recarga para admin
  function showRechargeModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const modalHTML = `
      <div id="recharge-user-modal" class="modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h3>Recargar saldo a ${user.name || user.email}</h3>
          <div class="form-group">
            <label>Monto:</label>
            <input type="number" id="recharge-amount" min="10000" step="10000" value="10000">
          </div>
          <button id="confirm-recharge" class="btn btn-primary">
            <i class="fas fa-check"></i> Confirmar Recarga
          </button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById('recharge-user-modal');
    
    // Configurar eventos
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('#confirm-recharge').addEventListener('click', () => {
      const amount = parseInt(document.getElementById('recharge-amount').value);
      if (amount > 0) {
        user.balance += amount;
        
        // Actualizar saldo si es el usuario actual
        const currentEmail = document.getElementById('login-email')?.value;
        if (user.email === currentEmail) {
          userBalance = user.balance;
          updateUserBalanceUI();
        }
        
        // Guardar cambios
        saveData();
        
        modal.remove();
        loadAdminUsers();
        alert(`Se recargaron $${amount.toLocaleString()} a ${user.name || user.email}`);
      }
    });
    
    // Cerrar al hacer clic fuera
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    });
  }

  // Cargar solicitudes de recarga
  function loadRechargeRequests() {
    const rechargesList = document.getElementById('admin-recharges-list');
    if (!rechargesList) return;
    
    rechargesList.innerHTML = '';
    
    // Ordenar solicitudes por fecha (más recientes primero)
    const sortedRequests = [...rechargeRequests].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedRequests.forEach(req => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${req.id}</td>
        <td>${req.userEmail}</td>
        <td>$${req.amount.toLocaleString()}</td>
        <td>${req.date}</td>
        <td>${req.status}</td>
        <td>
          <button class="btn btn-sm btn-approve" data-request-id="${req.id}" ${req.status !== 'Pendiente' ? 'disabled' : ''}>
            <i class="fas fa-check"></i> Aprobar
          </button>
          <button class="btn btn-sm btn-reject" data-request-id="${req.id}" ${req.status !== 'Pendiente' ? 'disabled' : ''}>
            <i class="fas fa-times"></i> Rechazar
          </button>
        </td>
      `;
      rechargesList.appendChild(row);
    });
    
    // Configurar eventos
    document.querySelectorAll('.btn-approve').forEach(btn => {
      btn.addEventListener('click', function() {
        const requestId = parseInt(this.getAttribute('data-request-id'));
        approveRechargeRequest(requestId, true);
      });
    });
    
    document.querySelectorAll('.btn-reject').forEach(btn => {
      btn.addEventListener('click', function() {
        const requestId = parseInt(this.getAttribute('data-request-id'));
        approveRechargeRequest(requestId, false);
      });
    });
  }

  // Aprobar/rechazar recargas - MODIFICADA
  function approveRechargeRequest(requestId, approve) {
    const requestIndex = rechargeRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) return;
    
    const request = rechargeRequests[requestIndex];
    
    if (approve) {
      const user = users.find(u => u.email === request.userEmail);
      if (user) {
        user.balance += request.amount;
        
        // Actualizar UI si el usuario está logueado
        if (user.email === document.getElementById('login-email')?.value) {
          userBalance = user.balance;
          updateUserBalanceUI();
        }
      }
      request.status = 'Aprobada';
      alert(`Recarga aprobada. Se han añadido $${request.amount.toLocaleString()} al saldo de ${request.userEmail}`);
    } else {
      request.status = 'Rechazada';
      alert(`Recarga rechazada para ${request.userEmail}`);
    }
    
    // Eliminar la solicitud procesada del array
    rechargeRequests.splice(requestIndex, 1);
    
    // Guardar cambios
    saveData();
    
    // Actualizar las vistas
    loadRechargeRequests();
    loadAdminUsers();
  }

  // Actualizar UI del saldo del usuario
  function updateUserBalanceUI() {
    if (currentBalance) currentBalance.textContent = `$${userBalance.toLocaleString()}`;
    const rechargeBalance = document.getElementById('current-balance-recharge');
    if (rechargeBalance) rechargeBalance.textContent = `$${userBalance.toLocaleString()}`;
    handleAuthUI();
  }

  // Enviar solicitud de recarga
  function sendRechargeRequest() {
    if (!isLoggedIn) {
      alert('Por favor inicie sesión para solicitar una recarga');
      if (loginModal) loginModal.style.display = 'flex';
      return;
    }
    
    const amountInput = document.getElementById('custom-amount');
    if (!amountInput) return;
    
    const amount = parseInt(amountInput.value);
    
    if (isNaN(amount) || amount < 10000) {
      alert('Por favor seleccione un monto válido (mínimo $10,000)');
      return;
    }
    
    // Crear nueva solicitud
    const newRequest = {
      id: rechargeRequests.length > 0 ? Math.max(...rechargeRequests.map(r => r.id)) + 1 : 1,
      userId: users.find(u => u.email === document.getElementById('login-email')?.value)?.id || 0,
      userEmail: document.getElementById('login-email')?.value || 'usuario@example.com',
      amount: amount,
      proof: 'pendiente_de_envio.jpg',
      status: 'Pendiente',
      date: new Date().toISOString().split('T')[0]
    };
    
    rechargeRequests.push(newRequest);
    saveData();
    
    alert(`Solicitud de recarga por $${amount.toLocaleString()} enviada correctamente.\nPor favor envíe el comprobante de pago a megacashh096@gmail.com`);
    
    // Si es admin, actualizar la lista de solicitudes
    if (isAdmin) {
      loadRechargeRequests();
    }
  }

  // Obtener resultados de Baloto (simulado)
  function fetchBalotoResults() {
    // Simular llamada a API
    alert('Obteniendo últimos resultados de Baloto...');
    
    // Datos de ejemplo
    const exampleResults = {
      numbers: [7, 14, 23, 35, 42],
      extra: 12,
      date: new Date().toISOString().split('T')[0]
    };
    
    // Autocompletar el formulario manual
    const resultDate = document.getElementById('result-date');
    if (resultDate) resultDate.value = exampleResults.date;
    
    // Seleccionar números en el grid
    exampleResults.numbers.forEach(num => {
      const numElement = Array.from(document.querySelectorAll('#admin-main-numbers .number-circle'))
        .find(el => parseInt(el.textContent) === num);
      if (numElement) numElement.classList.add('selected');
    });
    
    const extraElement = Array.from(document.querySelectorAll('#admin-extra-number .number-circle'))
      .find(el => parseInt(el.textContent) === exampleResults.extra);
    if (extraElement) extraElement.classList.add('selected');
    
    const manualResultsForm = document.getElementById('manual-results-form');
    if (manualResultsForm) manualResultsForm.style.display = 'block';
  }

  // Guardar resultados manuales
  function saveManualResults() {
    const mainNumbers = Array.from(document.querySelectorAll('#admin-main-numbers .selected'))
      .map(el => parseInt(el.textContent))
      .filter(n => !isNaN(n));
    
    const extraNumber = parseInt(document.querySelector('#admin-extra-number .selected')?.textContent);
    const date = document.getElementById('result-date')?.value;
    
    if (mainNumbers.length === 5 && !isNaN(extraNumber) && date) {
      // Calcular premio (simulado)
      const prize = calculatePrize(mainNumbers, extraNumber);
      
      // Crear nuevo resultado
      const newResult = {
        date: date,
        numbers: mainNumbers,
        extra: extraNumber,
        prize: prize
      };
      
      // Agregar a los resultados
      lotteryResults.unshift(newResult);
      saveData();
      
      // Añadir a la tabla
      addResultToTable(date, mainNumbers, extraNumber, prize);
      
      alert(`Resultados guardados exitosamente para el ${date}\nNúmeros: ${mainNumbers.join(', ')}\nExtra: ${extraNumber}`);
      
      // Limpiar formulario
      document.querySelectorAll('.number-circle.selected').forEach(el => {
        el.classList.remove('selected');
      });
      const manualResultsForm = document.getElementById('manual-results-form');
      if (manualResultsForm) manualResultsForm.style.display = 'none';
    } else {
      alert('Por favor complete todos los campos:\n- Seleccione 5 números principales\n- Seleccione 1 número extra\n- Ingrese una fecha válida');
    }
  }

  // Añadir resultado a la tabla
  function addResultToTable(date, numbers, extra, prize = '') {
    const resultsBody = document.getElementById('results-body');
    if (!resultsBody) return;
    
    // Si no se proporciona premio, calcularlo
    const displayPrize = prize || calculatePrize(numbers, extra);
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${date}</td>
      <td>${numbers.join(', ')}</td>
      <td>${extra}</td>
      <td>${displayPrize}</td>
    `;
    
    // Insertar al principio de la tabla
    if (resultsBody.firstChild) {
      resultsBody.insertBefore(row, resultsBody.firstChild);
    } else {
      resultsBody.appendChild(row);
    }
  }

  // Función para calcular premio
  function calculatePrize(numbers, extra) {
    // Esta es una implementación de ejemplo
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    
    // Ejemplo simple basado en fecha y números
    const basePrize = (numbers.reduce((a, b) => a + b, 0) + extra) * 1000;
    const multiplier = day * month;
    
    return `$${(basePrize * multiplier).toLocaleString()}`;
  }

  // Manejar modales
  function setupModals() {
    if (loginBtn && loginModal) {
      loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
      });
    }

    if (registerBtn && registerModal) {
      registerBtn.addEventListener('click', () => {
        registerModal.style.display = 'flex';
      });
    }

    if (closeModalButtons) {
      closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
          if (loginModal) loginModal.style.display = 'none';
          if (registerModal) registerModal.style.display = 'none';
        });
      });
    }

    window.addEventListener('click', (event) => {
      if (loginModal && event.target === loginModal) {
        loginModal.style.display = 'none';
      }
      if (registerModal && event.target === registerModal) {
        registerModal.style.display = 'none';
      }
    });
  }

  // Manejar login/logout
  function handleAuthUI() {
    if (isLoggedIn) {
      if (authButtons) authButtons.style.display = 'none';
      if (userPanel) userPanel.style.display = 'flex';
      
      const email = document.getElementById('login-email')?.value;
      const currentUser = users.find(u => u.email === email) || { email: email, balance: 0, name: 'Usuario' };
      
      if (isAdmin) {
        if (adminPanel) adminPanel.style.display = 'block';
        if (userGreeting) userGreeting.innerHTML = `${currentUser.name} <span class="user-balance">$${userBalance.toLocaleString()}</span>`;
      } else {
        if (adminPanel) adminPanel.style.display = 'none';
        if (userGreeting) userGreeting.innerHTML = `${currentUser.name || currentUser.email.split('@')[0]} <span class="user-balance">$${currentUser.balance.toLocaleString()}</span>`;
      }
      
      // Actualizar saldo en todas las secciones
      updateUserBalanceUI();
    } else {
      if (authButtons) authButtons.style.display = 'flex';
      if (userPanel) userPanel.style.display = 'none';
      if (adminPanel) adminPanel.style.display = 'none';
    }
  }

  // Cerrar sesión
  function logout() {
    isLoggedIn = false;
    isAdmin = false;
    handleAuthUI();
    hideAllSections();
    if (homeSection) homeSection.style.display = 'block';
    removeActiveClass();
    if (navHome) navHome.classList.add('active');
    
    // Limpiar selección de números
    clearSelection();
  }

  // Inicializar
  initNumberGrid();
  setupNavigation();
  setupModals();
  handleAuthUI();
  
  // Mostrar sección de inicio por defecto
  hideAllSections();
  if (homeSection) homeSection.style.display = 'block';
  if (navHome) navHome.classList.add('active');

  // Event listeners
  if (randomBtn) randomBtn.addEventListener('click', generateRandomNumbers);
  if (clearBtn) clearBtn.addEventListener('click', clearSelection);
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
  
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (!isLoggedIn) {
        alert('Por favor inicia sesión para jugar');
        if (loginModal) loginModal.style.display = 'flex';
        return;
      }
      
      if (userBalance < 5000) {
        alert('Saldo insuficiente. Por favor recarga tu cuenta.');
        return;
      }
      
      userBalance -= 5000;
      
      // Actualizar saldo en el array de usuarios
      const email = document.getElementById('login-email')?.value;
      const currentUser = users.find(u => u.email === email);
      if (currentUser) {
        currentUser.balance = userBalance;
        saveData();
      }
      
      // Guardar el ticket jugado
      const playedTickets = JSON.parse(localStorage.getItem('megacash_tickets')) || [];
      playedTickets.push({
        userEmail: email,
        numbers: selectedNumbers,
        extra: selectedExtraNumber,
        date: new Date().toISOString().split('T')[0]
      });
      localStorage.setItem('megacash_tickets', JSON.stringify(playedTickets));
      
      updateUserBalanceUI();
      
      alert(`¡Jugado con los números: ${selectedNumbers.join(', ')} y extra: ${selectedExtraNumber}!`);
    });
  }

  // Login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      // Verificar credenciales
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        alert('Credenciales incorrectas');
        return;
      }

      isAdmin = user.isAdmin || false;
      isLoggedIn = true;
      userBalance = user.balance;
      
      if (loginModal) loginModal.style.display = 'none';
      handleAuthUI();
      alert(`Inicio de sesión exitoso${isAdmin ? ' como administrador' : ''}`);
    });
  }

  // Registro
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm').value;
      
      // Validaciones
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      
      if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      
      // Verificar si el usuario ya existe
      if (users.some(u => u.email === email)) {
        alert('Este correo ya está registrado');
        return;
      }
      
      // Crear nuevo usuario con saldo 0
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        email: email,
        password: password,
        balance: 0,
        isAdmin: false,
        name: email.split('@')[0]
      };
      
      users.push(newUser);
      saveData();
      
      if (registerModal) registerModal.style.display = 'none';
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
    });
  }
});