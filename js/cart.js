const WHATSAPP_NUMBER = "5516996074438";

const STORAGE_KEY = "cremoso_cart";

let cart = loadCart();

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    /* localStorage indisponível, segue só em memória */
  }
}

function formatBRL(value) {
  return "R$ " + value.toFixed(2).replace(".", ",");
}

function addToCart(id, name, price, qty) {
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, price, qty });
  }
  saveCart();
  renderCart();
  pulseCartFab();
}

function pulseCartFab() {
  const fab = document.getElementById("cart-fab");
  fab.classList.remove("pulse");
  void fab.offsetWidth;
  fab.classList.add("pulse");
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
}

function changeCartItemQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
    renderCart();
  }
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCart() {
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total-value");
  const countEl = document.getElementById("cart-fab-count");
  const whatsappBtn = document.getElementById("cart-whatsapp-btn");

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
  } else {
    itemsEl.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatBRL(item.price)} cada</div>
          </div>
          <div class="cart-item-qty">
            <button data-action="dec">&minus;</button>
            <span>${item.qty}</span>
            <button data-action="inc">+</button>
          </div>
          <button class="cart-item-remove" data-action="remove">remover</button>
        </div>`
      )
      .join("");
  }

  const total = cartTotal();
  totalEl.textContent = formatBRL(total);

  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = count;

  whatsappBtn.disabled = cart.length === 0;
}

function openDrawer() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
  document.getElementById("cart-drawer").setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("open");
  document.getElementById("cart-drawer").setAttribute("aria-hidden", "true");
}

let quickviewCard = null;
let quickviewQty = 1;

function getCardDesc(card) {
  if (card.dataset.desc) return card.dataset.desc;
  const descEl = card.querySelector(".flavor-desc");
  return descEl ? descEl.textContent.trim() : "";
}

function openQuickview(card) {
  quickviewCard = card;
  quickviewQty = 1;

  const img = card.querySelector("img");
  document.getElementById("quickview-image").src = img ? img.src : "";
  document.getElementById("quickview-image").alt = card.dataset.name || "";
  document.getElementById("quickview-name").textContent = card.dataset.name || "";
  document.getElementById("quickview-desc").textContent = getCardDesc(card);
  document.getElementById("quickview-price").textContent = formatBRL(parseFloat(card.dataset.price));
  document.getElementById("quickview-qty").textContent = quickviewQty;

  document.getElementById("quickview-overlay").classList.add("open");
  document.getElementById("quickview-modal").classList.add("open");
  document.getElementById("quickview-modal").setAttribute("aria-hidden", "false");
}

function closeQuickview() {
  document.getElementById("quickview-overlay").classList.remove("open");
  document.getElementById("quickview-modal").classList.remove("open");
  document.getElementById("quickview-modal").setAttribute("aria-hidden", "true");
  quickviewCard = null;
}

function buildWhatsAppMessage() {
  const lines = ["Olá! Gostaria de fazer o seguinte pedido na Sorvete Cremoso:", ""];
  cart.forEach((item) => {
    lines.push(`• ${item.qty}x ${item.name} - ${formatBRL(item.price * item.qty)}`);
  });
  lines.push("");
  lines.push(`Total: ${formatBRL(cartTotal())}`);
  return lines.join("\n");
}

function sendOrderToWhatsApp() {
  if (cart.length === 0) return;
  const message = buildWhatsAppMessage();
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

let scrollBlurTimeout;
function triggerScrollBlur(duration) {
  const pageWrap = document.querySelector(".page-wrap");
  pageWrap.classList.add("is-scrolling");
  clearTimeout(scrollBlurTimeout);

  if ("onscrollend" in window) {
    const onScrollEnd = () => {
      pageWrap.classList.remove("is-scrolling");
      window.removeEventListener("scrollend", onScrollEnd);
    };
    window.addEventListener("scrollend", onScrollEnd);
  } else {
    scrollBlurTimeout = setTimeout(() => {
      pageWrap.classList.remove("is-scrolling");
    }, duration || 700);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href").slice(1);
      if (!id || !document.getElementById(id)) return;
      triggerScrollBlur();
    });
  });

  function setupCarouselNav(gridEl, navEl) {
    if (!gridEl || !navEl) return;
    const prevBtn = navEl.querySelector('[aria-label="Anterior"]');
    const nextBtn = navEl.querySelector('[aria-label="Próximo"]');
    if (!prevBtn || !nextBtn) return;

    const scrollStep = () => {
      const card = gridEl.firstElementChild;
      const gap = parseFloat(getComputedStyle(gridEl).gap) || 22;
      return card ? card.getBoundingClientRect().width + gap : 250;
    };
    prevBtn.addEventListener("click", () => {
      gridEl.scrollBy({ left: -scrollStep(), behavior: "smooth" });
    });
    nextBtn.addEventListener("click", () => {
      gridEl.scrollBy({ left: scrollStep(), behavior: "smooth" });
    });
  }

  const shakesGrid = document.querySelector(".shakes-grid");
  setupCarouselNav(shakesGrid, document.querySelector(".shakes-nav"));

  document.querySelectorAll(".flavors-grid").forEach((grid) => {
    const section = grid.closest("section");
    if (!section) return;

    const nav = section.querySelector(".flavors-nav");
    setupCarouselNav(grid, nav);

    const viewAllBtn = section.querySelector(".view-all-btn");
    if (!viewAllBtn) return;

    const baseLabel = viewAllBtn.textContent.trim();
    viewAllBtn.addEventListener("click", () => {
      const expanded = grid.classList.toggle("expanded");
      viewAllBtn.textContent = expanded ? "VER EM CARROSSEL" : baseLabel;
      grid.scrollLeft = 0;
      if (nav) nav.style.display = expanded ? "none" : "flex";

      triggerScrollBlur();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll(".product-card").forEach((card) => {
    const qtyValueEl = card.querySelector(".qty-value");
    let qty = parseInt(qtyValueEl.textContent, 10) || 1;

    card.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.action === "inc") {
          qty += 1;
        } else if (qty > 1) {
          qty -= 1;
        }
        qtyValueEl.textContent = qty;
      });
    });

    const addBtn = card.querySelector(".add-to-cart-btn");
    addBtn.addEventListener("click", () => {
      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);
      addToCart(id, name, price, qty);

      qty = 1;
      qtyValueEl.textContent = qty;

      addBtn.textContent = "Adicionado!";
      addBtn.classList.add("added");
      setTimeout(() => {
        addBtn.textContent = "Adicionar";
        addBtn.classList.remove("added");
      }, 1200);
    });

    card.addEventListener("click", (e) => {
      if (e.target.closest(".qty-btn, .add-to-cart-btn")) return;
      openQuickview(card);
    });
  });

  document.getElementById("cart-items").addEventListener("click", (e) => {
    const itemEl = e.target.closest(".cart-item");
    if (!itemEl) return;
    const id = itemEl.dataset.id;
    const action = e.target.dataset.action;
    if (action === "inc") changeCartItemQty(id, 1);
    if (action === "dec") changeCartItemQty(id, -1);
    if (action === "remove") removeFromCart(id);
  });

  document.getElementById("cart-fab").addEventListener("click", openDrawer);
  document.getElementById("cart-close").addEventListener("click", closeDrawer);
  document.getElementById("cart-overlay").addEventListener("click", closeDrawer);
  document.getElementById("cart-whatsapp-btn").addEventListener("click", sendOrderToWhatsApp);

  const quickviewQtyEl = document.getElementById("quickview-qty");
  document.getElementById("quickview-modal").querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.action === "inc") {
        quickviewQty += 1;
      } else if (quickviewQty > 1) {
        quickviewQty -= 1;
      }
      quickviewQtyEl.textContent = quickviewQty;
    });
  });

  document.getElementById("quickview-add-btn").addEventListener("click", () => {
    if (!quickviewCard) return;
    const id = quickviewCard.dataset.id;
    const name = quickviewCard.dataset.name;
    const price = parseFloat(quickviewCard.dataset.price);
    addToCart(id, name, price, quickviewQty);
    closeQuickview();
  });

  document.getElementById("quickview-close").addEventListener("click", closeQuickview);
  document.getElementById("quickview-overlay").addEventListener("click", closeQuickview);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeQuickview();
  });
});
