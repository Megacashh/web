document.addEventListener('DOMContentLoaded', function() {
    // Inicialización de la aplicación
    initNumberGrid();
    loadHistoricResults();
    setupEventListeners();
    
    // Verificar si el usuario está logueado
    checkAuthStatus();
  });
  
  function initNumberGrid() {
    const grid = document.getElementById('number-grid');
    // Baloto usa números del 1 al 43
    for (let i = 1; i <= 43; i++) {
      const number = document.createElement('div');
      number.className = 'number';
      number.textContent = i;
      number.dataset.number = i;
      number.addEventListener('click', toggleNumberSelection);
      grid.appendChild(number);
    }
  }
  
  function toggleNumberSelection(e) {
    const number = e.target;
    number.classList.toggle('selected');
    
    // Verificar si ya hay 5 números seleccionados (más la balota)
    const selected = document.querySelectorAll('.number.selected');
    if (selected.length > 5) {
      alert('Solo puedes seleccionar 5 números más la balota');
      number.classList.remove('selected');
    }
  }
  
  function loadHistoricResults() {
    // Aquí harías una llamada a tu API para obtener los resultados históricos
    fetch('/api/lottery/historic')
      .then(response => response.json())
      .then(data => {
        const tbody = document.querySelector('#historic-results tbody');
        tbody.innerHTML = '';
        
        data.forEach(result => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${new Date(result.date).toLocaleDateString()}</td>
            <td>${result.numbers.join(', ')}</td>
            <td>${result.balota}</td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(error => console.error('Error cargando resultados:', error));
  }
  
  function setupEventListeners() {
    // Botón de selección aleatoria
    document.getElementById('random-btn').addEventListener('click', generateRandomNumbers);
    
    // Botón de limpiar selección
    document.getElementById('clear-btn').addEventListener('click', clearSelection);
    
    // Botón de jugar
    document.getElementById('play-btn').addEventListener('click', playLottery);
    
    // Botón de recargar saldo
    document.getElementById('recharge-btn').addEventListener('click', showPaymentModal);
    
    // Botones de autenticación
    document.getElementById('login-btn').addEventListener('click', showLoginModal);
    document.getElementById('register-btn').addEventListener('click', showRegisterModal);
  }
  
  function generateRandomNumbers() {
    clearSelection();
    
    // Seleccionar 5 números únicos
    const numbers = [];
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 43) + 1;
      if (!numbers.includes(num)) numbers.push(num);
    }
    
    // Seleccionar balota (1 al 16)
    const balota = Math.floor(Math.random() * 16) + 1;
    
    // Marcar los números seleccionados
    numbers.forEach(num => {
      const element = document.querySelector(`.number[data-number="${num}"]`);
      if (element) element.classList.add('selected');
    });
    
    // En una implementación real, también marcaríamos la balota
  }
  
  function clearSelection() {
    document.querySelectorAll('.number.selected').forEach(num => {
      num.classList.remove('selected');
    });
  }
  
  function playLottery() {
    const selectedNumbers = Array.from(document.querySelectorAll('.number.selected'))
      .map(el => parseInt(el.dataset.number));
    
    if (selectedNumbers.length !== 5) {
      alert('Debes seleccionar exactamente 5 números');
      return;
    }
    
    // En una implementación real, aquí enviarías los números al servidor
    fetch('/api/lottery/play', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ numbers: selectedNumbers })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('¡Ticket comprado con éxito!');
        updateUserBalance(data.newBalance);
      } else {
        alert(data.message || 'Error al comprar el ticket');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al procesar tu jugada');
    });
  }
  
  function showPaymentModal() {
    // Implementar lógica para mostrar modal de pago con PayPal
    const amount = prompt('Ingrese el monto a recargar:');
    if (amount && !isNaN(amount) && amount > 0) {
      createPayPalPayment(parseFloat(amount));
    }
  }
  
  function createPayPalPayment(amount) {
    // Implementar integración con PayPal
    fetch('/api/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ amount })
    })
    .then(response => response.json())
    .then(data => {
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        alert('Error al crear el pago');
      }
    });
  }
  
  function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar token con el servidor
      fetch('/auth/check', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.authenticated) {
          updateUIForLoggedInUser(data.user);
        } else {
          localStorage.removeItem('token');
        }
      });
    }
  }
  
  function updateUIForLoggedInUser(user) {
    document.getElementById('login-btn').style.display = 'none';
    document.getElementById('register-btn').style.display = 'none';
    
    const userMenu = document.querySelector('.user-menu');
    const welcomeMsg = document.createElement('span');
    welcomeMsg.textContent = `Hola, ${user.email}`;
    userMenu.insertBefore(welcomeMsg, document.getElementById('user-balance'));
    
    document.getElementById('user-balance').textContent = `$${user.balance.toFixed(2)}`;
    
    if (user.role === 'admin') {
      document.getElementById('admin-btn').style.display = 'inline-block';
    }
  }