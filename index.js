const MENU_ITEMS = [
      { id: 1, name: 'Lobster Thermidor', description: 'Classic French preparation with cognac cream sauce', price: 75, category: 'main' },
      { id: 2, name: 'Wagyu Beef Tenderloin', description: 'A5 Japanese Wagyu, truffle butter, seasonal vegetables', price: 120, category: 'main' },
      { id: 3, name: 'Pan-Seared Foie Gras', description: 'Hudson Valley foie gras, fig compote, brioche', price: 65, category: 'appetizer' },
      { id: 4, name: 'Beluga Caviar Service', description: '30g Beluga caviar, blinis, crème fraîche', price: 195, category: 'appetizer' },
      { id: 5, name: 'Black Truffle Risotto', description: 'Carnaroli rice, fresh Périgord truffles, aged Parmigiano', price: 85, category: 'main' },
      { id: 6, name: 'Chilean Sea Bass', description: 'Miso-glazed, baby bok choy, ginger beurre blanc', price: 95, category: 'main' },
      { id: 7, name: 'Château Margaux 2015', description: 'Premier Grand Cru Classé, Bordeaux', price: 450, category: 'beverage' },
      { id: 8, name: 'Dom Pérignon 2012', description: 'Vintage Champagne, Épernay', price: 300, category: 'beverage' },
      { id: 9, name: 'Louis XIII Cognac', description: 'Rémy Martin, 2oz pour', price: 275, category: 'beverage' },
      { id: 10, name: 'Valrhona Chocolate Soufflé', description: 'Dark chocolate soufflé, vanilla bean ice cream', price: 35, category: 'dessert' },
      { id: 11, name: 'Crème Brûlée', description: 'Madagascar vanilla, caramelized sugar crust', price: 28, category: 'dessert' },
      { id: 12, name: 'Tasting Menu Experience', description: '8-course chef\'s selection with wine pairings', price: 385, category: 'main' }
  ];

  let currentOrder = [];
  let chatState = 'main';
  let isProcessing = false;

  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const sendButton = document.getElementById('sendButton');
  const typingIndicator = document.getElementById('typingIndicator');

  function formatTime() {
      const now = new Date();
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function addMessage(content, type) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type}`;

      const bubbleDiv = document.createElement('div');
      bubbleDiv.className = 'message-bubble';

      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      contentDiv.textContent = content;

      const timeDiv = document.createElement('div');
      timeDiv.className = 'message-time';
      timeDiv.textContent = formatTime();

      bubbleDiv.appendChild(contentDiv);
      bubbleDiv.appendChild(timeDiv);
      messageDiv.appendChild(bubbleDiv);

      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
      typingIndicator.classList.add('active');
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTyping() {
      typingIndicator.classList.remove('active');
  }

  function showMainMenu() {
      const menuText = `Welcome to Le Château. How may I assist you today?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1  →  Place a New Order
99  →  Checkout Current Order
98  →  View Order History
97  →  View Current Order
0  →  Cancel Current Order

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please enter your selection.`;
      addMessage(menuText, 'bot');
      chatState = 'main';
  }

  function showMenu() {
      const categories = ['appetizer', 'main', 'beverage', 'dessert'];
      let menuText = 'Our Exquisite Menu:\n\n';

      categories.forEach(category => {
          const items = MENU_ITEMS.filter(item => item.category === category);
          if (items.length > 0) {
              menuText += `━━ ${category.toUpperCase()} ━━\n\n`;
              items.forEach(item => {
                  menuText += `  ${item.id}. ${item.name}\n`;
                  menuText += `     ${item.description}\n`;
                  menuText += `     $${item.price}\n\n`;
              });
          }
      });

      menuText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      menuText += `Enter the item number to add to your order, or type 'back' to return to main menu.`;

      addMessage(menuText, 'bot');
      chatState = 'ordering';
  }

  function showCurrentOrder() {
      if (currentOrder.length === 0) {
          addMessage('Your current order is empty.', 'bot');
          return;
      }

      let orderText = 'Your Current Order:\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
      let total = 0;

      currentOrder.forEach((item, index) => {
          const itemTotal = item.price * item.quantity;
          total += itemTotal;
          orderText += `${index + 1}. ${item.name}\n`;
          orderText += `   Quantity: ${item.quantity}\n`;
          orderText += `   $${item.price} × ${item.quantity} = $${itemTotal}\n\n`;
      });

      orderText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      orderText += `Total: $${total.toFixed(2)}`;

      addMessage(orderText, 'bot');
  }

  function handleCheckout() {
      if (currentOrder.length === 0) {
          addMessage('No order to place. Please add items to your order first.', 'bot');
          setTimeout(showMainMenu, 500);
          return;
      }

      const total = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);

      let checkoutText = 'Order Summary\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

      currentOrder.forEach(item => {
          checkoutText += `${item.name}\n`;
          checkoutText += `$${item.price} × ${item.quantity} = $${item.price * item.quantity}\n\n`;
      });

      checkoutText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      checkoutText += `Total Amount: $${total.toFixed(2)}`;

      addMessage(checkoutText, 'bot');

      setTimeout(() => {
          const successText = `✓ Order Confirmed Successfully!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nThank you for dining with Le Château.\n\nYour exquisite selection has been confirmed and our culinary team is preparing your order with the utmost care.\n\nOrder Total: $${total.toFixed(2)}\n\nWe look forward to serving you an unforgettable dining experience.`;

          addMessage(successText, 'bot');
          currentOrder = [];

          setTimeout(showMainMenu, 2000);
      }, 1500);
  }

  function handleOrderHistory() {
      const historyText = `Order History\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nYour order history is currently empty.\n\nOnce you complete your first order, it will appear here.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

      addMessage(historyText, 'bot');
      setTimeout(showMainMenu, 500);
  }

  function handleCancelOrder() {
      if (currentOrder.length === 0) {
          addMessage('No active order to cancel.', 'bot');
          setTimeout(showMainMenu, 500);
          return;
      }

      currentOrder = [];
      addMessage('Your current order has been cancelled.', 'bot');
      setTimeout(showMainMenu, 500);
  }

  function handleUserInput(input) {
      if (isProcessing) return;

      isProcessing = true;
      sendButton.disabled = true;
      chatInput.disabled = true;

      addMessage(input, 'user');

      showTyping();

      setTimeout(() => {
          hideTyping();

          if (chatState === 'main') {
              const choice = input.trim();

              switch (choice) {
                  case '1':
                      showMenu();
                      break;
                  case '99':
                      handleCheckout();
                      break;
                  case '98':
                      handleOrderHistory();
                      break;
                  case '97':
                      showCurrentOrder();
                      setTimeout(showMainMenu, 500);
                      break;
                  case '0':
                      handleCancelOrder();
                      break;
                  default:
                      addMessage('Invalid selection. Please choose from the menu options.', 'bot');
                      setTimeout(showMainMenu, 500);
              }
          } else if (chatState === 'ordering') {
              if (input.toLowerCase() === 'back') {
                  showMainMenu();
              } else {
                  const itemId = parseInt(input.trim());
                  const menuItem = MENU_ITEMS.find(item => item.id === itemId);

                  if (menuItem) {
                      const existingItem = currentOrder.find(item => item.id === menuItem.id);

                      if (existingItem) {
                          existingItem.quantity += 1;
                      } else {
                          currentOrder.push({ ...menuItem, quantity: 1 });
                      }

                      addMessage(`Added ${menuItem.name} to your order.\n\nWould you like to add more items, or type 'back' to return to main menu.`, 'bot');
                  } else {
                      addMessage('Invalid item number. Please select a valid item from the menu.', 'bot');
                      setTimeout(showMenu, 500);
                  }
              }
          }

          isProcessing = false;
          sendButton.disabled = false;
          chatInput.disabled = false;
          chatInput.focus();
      }, 1000);
  }

  chatForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const input = chatInput.value.trim();
      if (input && !isProcessing) {
          handleUserInput(input);
          chatInput.value = '';
      }
  });

  showMainMenu();

