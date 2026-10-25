function getCart() {
  const stored = localStorage.getItem('restoCart');
  return stored ? JSON.parse(stored) : [];
}
function ouvrirLogo() {
  document.getElementById("popup").style.display = "flex";
}

function fermerLogo() {
  document.getElementById("popup").style.display = "none";
}

function saveCart(cart) {
  localStorage.setItem('restoCart', JSON.stringify(cart));
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  const countElement = document.getElementById('cart-count');
  if (countElement) {
    countElement.textContent = count;
  }
}

function addToCart(name, price) {
  const cart = getCart();
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert(`${name} ajouté au panier !`);
}

function renderCartPage() {
  const cartContainer = document.getElementById('cart-items');
  if (!cartContainer) {
    return;
  }
  const cart = getCart();
  cartContainer.innerHTML = '';
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Votre panier est vide. Ajoutez des plats ou boissons depuis les pages Menu et Boisson.</p>';
    document.getElementById('cart-total').textContent = '0 FCFA';
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
    const card = document.createElement('article');
    card.className = 'cart-card';
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p class="quantity">Quantité : ${item.quantity}</p>
      <p>Prix unitaire : ${item.price.toLocaleString()} FCFA</p>
      <p>Sous-total : ${(item.price * item.quantity).toLocaleString()} FCFA</p>
    `;
    cartContainer.appendChild(card);
  });

  document.getElementById('cart-total').textContent = `${total.toLocaleString()} FCFA`;
}

function initAddButtons() {
  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.dataset.name;
      const price = Number(button.dataset.price);
      if (name && price) {
        addToCart(name, price);
      }
    });
  });
}

function initClearCart() {
  const clearButton = document.getElementById('clear-cart');
  if (!clearButton) {
    return;
  }
  clearButton.addEventListener('click', () => {
    localStorage.removeItem('restoCart');
    updateCartCount();
    renderCartPage();
  });
}

function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length === 0) {
    return;
  }
  let activeIndex = 0;
  slides[activeIndex].classList.add('active');

  const showSlide = (index) => {
    slides[activeIndex].classList.remove('active');
    activeIndex = (index + slides.length) % slides.length;
    slides[activeIndex].classList.add('active');
  };

  document.querySelector('.carousel-prev')?.addEventListener('click', () => showSlide(activeIndex - 1));
  document.querySelector('.carousel-next')?.addEventListener('click', () => showSlide(activeIndex + 1));
  setInterval(() => showSlide(activeIndex + 1), 5000);
}

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle') || document.querySelector('#toggle-btn');
  const nav = document.querySelector('.site-nav') || document.querySelector('#ulref');
  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (toggle.id === 'toggle-btn') {
      toggle.classList.toggle('open', isOpen);
    }
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        if (toggle.id === 'toggle-btn') {
          toggle.classList.remove('open');
        }
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initNavToggle();
  updateCartCount();
  initAddButtons();
  initClearCart();
  renderCartPage();
});
