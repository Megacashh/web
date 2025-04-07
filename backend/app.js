document.addEventListener('DOMContentLoaded', function() {
  // Variables de estado
  let selectedNumbers = [];
  let selectedExtraNumber = null;
  let userBalance = 0;
  let isLoggedIn = false;

  // Elementos del DOM
  const numberGrid = document.getElementById('number-grid');
  const currentBalance = document.getElementById('current-balance');
  const playBtn = document.getElementById('play-btn');
  const randomBtn = document.getElementById('random-btn');
  const clearBtn = document.getElementById('clear-btn');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const loginModal = document.getElementById('login-modal');
  const registerModal = document.getElementById('register-modal');
  const closeModalButtons = document.querySelectorAll('.close-modal');
  const navPlay = document.getElementById('nav-play');
  const navResults = document.getElementById('nav-results');
  const navRecharge = document.getElementById('nav-recharge');
  const playSection = document.getElementById('play-section');
  const resultsSection = document.getElementById('results-section');
  const rechargeSection = document.getElementById('recharge-section');

  // Inicializar la cuadrícula de números
  function initNumberGrid() {
      numberGrid.innerHTML = '';
      
      // Números principales (1-45)
      for (let i = 1; i <= 45; i++) {
          const numberElement = document.createElement('div');
          numberElement.className = 'number-circle';
          numberElement.textContent = i;
          numberElement.addEventListener('click', () => selectNumber(i, false));
          numberGrid.appendChild(numberElement);
      }
      
      // Número extra (1-20)
      const extraNumberElement = document.createElement('div');
      extraNumberElement.className = 'number-circle extra';
      extraNumberElement.textContent = 'E';
      extraNumberElement.addEventListener('click', () => {
          const extraNum = Math.floor(Math.random() * 20) + 1;
          selectNumber(extraNum, true);
      });
      numberGrid.appendChild(extraNumberElement);
  }

  // Seleccionar número
  function selectNumber(num, isExtra) {
      if (isExtra) {
          selectedExtraNumber = num;
          document.querySelectorAll('.number-circle.extra').forEach(el => {
              el.classList.remove('selected');
          });
          const extraElement = document.querySelector(`.number-circle.extra`);
          extraElement.textContent = num;
          extraElement.classList.add('selected');
          return;
      }

      const index = selectedNumbers.indexOf(num);
      const numberElement = Array.from(document.querySelectorAll('.number-circle'))
          .find(el => el.textContent == num && !el.classList.contains('extra'));

      if (index === -1) {
          if (selectedNumbers.length >= 5) return;
          selectedNumbers.push(num);
          numberElement.classList.add('selected');
      } else {
          selectedNumbers.splice(index, 1);
          numberElement.classList.remove('selected');
      }

      updatePlayButton();
  }

  // Actualizar estado del botón de jugar
  function updatePlayButton() {
      playBtn.disabled = !(selectedNumbers.length === 5 && selectedExtraNumber !== null);
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
      const extraElement = document.querySelector('.number-circle.extra');
      extraElement.textContent = selectedExtraNumber;
      extraElement.classList.add('selected');

      updatePlayButton();
  }

  // Limpiar selección
  function clearSelection() {
      selectedNumbers = [];
      selectedExtraNumber = null;
      document.querySelectorAll('.number-circle').forEach(el => {
          el.classList.remove('selected');
          if (el.classList.contains('extra')) {
              el.textContent = 'E';
          }
      });
      updatePlayButton();
  }

  // Manejar navegación entre secciones
  function setupNavigation() {
      navPlay.addEventListener('click', (e) => {
          e.preventDefault();
          playSection.style.display = 'block';
          resultsSection.style.display = 'none';
          rechargeSection.style.display = 'none';
          document.querySelector('.main-nav a.active')?.classList.remove('active');
          navPlay.classList.add('active');
      });

      navResults.addEventListener('click', (e) => {
          e.preventDefault();
          playSection.style.display = 'none';
          resultsSection.style.display = 'block';
          rechargeSection.style.display = 'none';
          document.querySelector('.main-nav a.active')?.classList.remove('active');
          navResults.classList.add('active');
          // Aquí podrías cargar resultados reales
          mockLoadResults();
      });

      navRecharge.addEventListener('click', (e) => {
          e.preventDefault();
          playSection.style.display = 'none';
          resultsSection.style.display = 'none';
          rechargeSection.style.display = 'block';
          document.querySelector('.main-nav a.active')?.classList.remove('active');
          navRecharge.classList.add('active');
      });
  }

  // Simular carga de resultados (mock)
  function mockLoadResults() {
      const resultsBody = document.getElementById('results-body');
      resultsBody.innerHTML = '';
      
      const mockResults = [
          { date: '2023-05-15', numbers: [5, 12, 23, 34, 45], extra: 7, prize: '$3,000,000' },
          { date: '2023-05-08', numbers: [3, 18, 22, 31, 44], extra: 12, prize: '$1,000,000' },
          { date: '2023-05-01', numbers: [7, 14, 25, 33, 42], extra: 5, prize: '$800' }
      ];

      mockResults.forEach(result => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${result.date}</td>
              <td>${result.numbers.join(', ')}</td>
              <td>${result.extra}</td>
              <td>${result.prize}</td>
          `;
          resultsBody.appendChild(row);
      });
  }

  // Manejar modales
  function setupModals() {
      loginBtn.addEventListener('click', () => {
          loginModal.style.display = 'block';
      });

      registerBtn.addEventListener('click', () => {
          registerModal.style.display = 'block';
      });

      closeModalButtons.forEach(button => {
          button.addEventListener('click', () => {
              loginModal.style.display = 'none';
              registerModal.style.display = 'none';
          });
      });

      window.addEventListener('click', (event) => {
          if (event.target === loginModal) {
              loginModal.style.display = 'none';
          }
          if (event.target === registerModal) {
              registerModal.style.display = 'none';
          }
      });
  }

  // Inicializar
  initNumberGrid();
  setupNavigation();
  setupModals();
  mockLoadResults();

  // Event listeners
  randomBtn.addEventListener('click', generateRandomNumbers);
  clearBtn.addEventListener('click', clearSelection);
  playBtn.addEventListener('click', () => {
      if (!isLoggedIn) {
          alert('Por favor inicia sesión para jugar');
          loginModal.style.display = 'block';
          return;
      }
      
      if (userBalance < 5000) {
          alert('Saldo insuficiente. Por favor recarga tu cuenta.');
          return;
      }
      
      userBalance -= 5000;
      currentBalance.textContent = `$${userBalance.toLocaleString()}`;
      
      // Simular juego (en una app real, esto llamaría a tu API)
      alert(`¡Jugado con los números: ${selectedNumbers.join(', ')} y extra: ${selectedExtraNumber}!`);
  });

  // Simular login/registro (en una app real, esto llamaría a tu API)
  document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      isLoggedIn = true;
      userBalance = 100000; // Saldo inicial de prueba
      currentBalance.textContent = `$${userBalance.toLocaleString()}`;
      loginModal.style.display = 'none';
      alert('Inicio de sesión exitoso');
  });

  document.getElementById('register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      registerModal.style.display = 'none';
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
  });
});