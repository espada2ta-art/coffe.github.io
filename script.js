
const products = [
  {
    id: 1,
    name: "Espresso",
    category: "coffee",
    description: "Насичена кава з глибоким смаком.",
    price: 55,
    image: "images/espresso.jpg"
  },
  {
    id: 2,
    name: "Cappuccino",
    category: "coffee",
    description: "Еспресо з ніжною молочною пінкою.",
    price: 75,
    image: "images/cappuccino.jpg"
  },
  {
    id: 3,
    name: "Caffè Latte",
    category: "coffee",
    description: "М'який кавовий смак із молоком.",
    price: 85,
    image: "images/latte.jpg"
  },
  {
    id: 4,
    name: "Matcha Latte",
    category: "tea",
    description: "Японський матча з ніжним молоком.",
    price: 95,
    image: "images/matcha.jpg"
  },
  {
    id: 5,
    name: "Green Tea",
    category: "tea",
    description: "Легкий зелений чай із тонким ароматом.",
    price: 60,
    image: "images/tea.jpg"
  },
  {
    id: 6,
    name: "Cheesecake",
    category: "dessert",
    description: "Ніжний вершковий десерт.",
    price: 90,
    image: "images/cheesecake.jpg"
  }
];

const menuGrid = document.querySelector("#menuGrid");
const filterButtons = document.querySelectorAll(".filter-button");;

let cart = [];

document.body.insertAdjacentHTML("beforeend", `
  <button class="cart-toggle" id="cartToggle">
    Кошик <span id="cartCount">0</span>
  </button>

  <div class="cart-overlay" id="cartOverlay">
    <div class="cart-panel">
      <div class="cart-header">
        <h2>Your order</h2>
        <button class="cart-close" id="cartClose">×</button>
      </div>

      <div class="cart-items" id="cartItems"></div>

      <div class="cart-footer">
        <div class="cart-total">
          <span>Total</span>
          <strong id="cartTotal">0 ₴</strong>
        </div>
        <button class="checkout-button" id="checkoutButton">
          Оформити замовлення
        </button>
      </div>
    </div>
  </div>
`);

function renderProducts(category = "all") {
  const filteredProducts = category === "all"
    ? products
    : products.filter(product => product.category === category);

  menuGrid.innerHTML = filteredProducts.map(product => `
    <article class="menu-card">
      <img
        src="${product.image}"
        alt="${product.name}"
        class="menu-card-image"
        onerror="this.style.display='none'"
      >

      <div class="menu-card-info">
        <span class="menu-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>

        <div class="menu-card-bottom">
          <span class="menu-price">${product.price} ₴</span>
          <button class="add-to-cart" data-id="${product.id}">
            Додати +
          </button>
        </div>
      </div>
    </article>
  `).join("");
}


// Фільтри меню
filterButtons.forEach(button => {
  button.addEventListener("click", () => {

    // Перемикання активної кнопки
    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    // Фільтрація товарів
    const category = button.dataset.category;

    renderProducts(category);
  });
});


menuGrid.addEventListener("click", event => {
  const button = event.target.closest(".add-to-cart");

  if (!button) return;

  const productId = Number(button.dataset.id);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      ...products.find(product => product.id === productId),
      quantity: 1
    });
  }

  updateCart();
});

function updateCart() {
  const cartItems = document.querySelector("#cartItems");
  const cartCount = document.querySelector("#cartCount");
  const cartTotal = document.querySelector("#cartTotal");

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = `${totalPrice} ₴`;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">Твій кошик поки порожній.</p>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <h3>${item.name}</h3>
        <p>${item.price} ₴ × ${item.quantity}</p>
      </div>

      <div class="cart-item-controls">
        <button data-action="minus" data-id="${item.id}">−</button>
        <span>${item.quantity}</span>
        <button data-action="plus" data-id="${item.id}">+</button>
        <button data-action="remove" data-id="${item.id}">×</button>
      </div>
    </div>
  `).join("");
}

document.querySelector("#cartItems").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;
  const item = cart.find(product => product.id === id);

  if (!item) return;

  if (action === "plus") {
    item.quantity++;
  }

  if (action === "minus") {
    item.quantity--;

    if (item.quantity <= 0) {
      cart = cart.filter(product => product.id !== id);
    }
  }

  if (action === "remove") {
    cart = cart.filter(product => product.id !== id);
  }

  updateCart();
});

const cartOverlay = document.querySelector("#cartOverlay");

document.querySelector("#cartToggle").addEventListener("click", () => {
  cartOverlay.classList.add("active");
});

document.querySelector("#cartClose").addEventListener("click", () => {
  cartOverlay.classList.remove("active");
});

cartOverlay.addEventListener("click", event => {
  if (event.target === cartOverlay) {
    cartOverlay.classList.remove("active");
  }
});

document.querySelector("#checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Спочатку додай товари до кошика.");
    return;
  }

  alert("Дякуємо! Замовлення оформленно.");
});

const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    navLinks.classList.contains("open")
  );
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

renderProducts();
updateCart();
