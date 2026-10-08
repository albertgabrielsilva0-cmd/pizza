/* TROCAR: número do WhatsApp da loja com DDI e DDD, só dígitos (ex.: "5511999999999").
   Vazio abre o WhatsApp para a pessoa escolher o contato. */
const WHATSAPP_NUMBER = "";

const STORAGE_KEY = "bemquerer_cart";
const catalog = window.CATALOG || { categories: [], products: [] };

let cart = loadCart();
let lastFocus = null;

/* ---------- utilidades ---------- */
function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function donutSVG(art = {}, label = "") {
  const vars = [`--glaze:${art.glaze || "#F50078"}`];
  if (art.dough) vars.push(`--dough:${art.dough}`);
  if (art.sprinkles === false) vars.push("--sprinkles:0");
  if (Array.isArray(art.sprinkles)) art.sprinkles.forEach((c, i) => vars.push(`--s${i + 1}:${c}`));
  const a11y = label ? `role="img" aria-label="${escapeHTML(label)}"` : 'aria-hidden="true"';
  return `<svg class="donut" ${a11y}><use href="#donut" style="${vars.join(";")}"/></svg>`;
}

function productMedia(p) {
  return p.image
    ? `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy">`
    : donutSVG(p.art, p.name);
}

/* ---------- catálogo ---------- */
function renderFeatured() {
  const el = document.querySelector("[data-featured]");
  if (!el) return;
  el.innerHTML = catalog.products
    .filter((p) => p.featured)
    .slice(0, 3)
    .map((p) => {
      const art = p.art || {};
      return `
      <a class="featured-card" href="#p-${escapeHTML(p.id)}" style="--card-bg:${art.bg || "var(--bg-alt)"}"${art.dark ? " data-dark" : ""}>
        ${p.image ? `<img class="featured-img" src="${escapeHTML(p.image)}" alt="" loading="lazy">` : donutSVG(art)}
        <span class="featured-name">${escapeHTML(p.name)}</span>
        <span class="link-arrow">Ver produto <span aria-hidden="true">→</span></span>
      </a>`;
    })
    .join("");
}

function renderFilters() {
  const el = document.querySelector("[data-filters]");
  if (!el) return;
  const all = [{ id: "todos", name: "Todos" }, ...catalog.categories];
  el.innerHTML = all
    .map((c, i) => `<button class="chip${i === 0 ? " is-active" : ""}" type="button" data-filter="${escapeHTML(c.id)}" aria-pressed="${i === 0}">${escapeHTML(c.name)}</button>`)
    .join("");

  el.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-filter]");
    if (!chip) return;
    el.querySelectorAll(".chip").forEach((c) => {
      const active = c === chip;
      c.classList.toggle("is-active", active);
      c.setAttribute("aria-pressed", active);
    });
    const filter = chip.dataset.filter;
    document.querySelectorAll("[data-products] .product-card").forEach((card) => {
      card.hidden = filter !== "todos" && card.dataset.category !== filter;
    });
  });
}

function renderProducts() {
  const el = document.querySelector("[data-products]");
  if (!el) return;
  el.innerHTML = catalog.products
    .map((p) => {
      const art = p.art || {};
      return `
      <article class="product-card" id="p-${escapeHTML(p.id)}" data-id="${escapeHTML(p.id)}" data-name="${escapeHTML(p.name)}" data-price="${p.price}" data-category="${escapeHTML(p.category)}">
        ${p.tag ? `<span class="tag${art.dark ? " tag--pink" : ""}">${escapeHTML(p.tag)}</span>` : ""}
        <div class="product-media" style="--media-bg:${art.bg || "var(--bg-alt)"}">${productMedia(p)}</div>
        <div class="product-body">
          <h3 class="product-name">${escapeHTML(p.name)}</h3>
          ${p.description ? `<p class="product-desc">${escapeHTML(p.description)}</p>` : ""}
          <div class="product-foot">
            <span class="price">${formatBRL(p.price)}</span>
            <button class="btn btn-primary btn-add" type="button" aria-label="Adicionar ${escapeHTML(p.name)} ao pedido">Adicionar</button>
          </div>
        </div>
      </article>`;
    })
    .join("");
}

/* ---------- carrinho ---------- */
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
    /* localStorage indisponível: segue só em memória */
  }
}

function cartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function addToCart(id, name, price) {
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, name, price, qty: 1 });
  saveCart();
  renderCart();
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  });
  showToast(`${name} adicionado ao pedido`);
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  const itemsEl = document.querySelector("[data-cart-items]");
  const count = cartCount();
  const total = formatBRL(cartTotal());

  document.querySelectorAll("[data-cart-count]").forEach((el) => (el.textContent = count));
  document.querySelectorAll("[data-cart-total]").forEach((el) => (el.textContent = total));
  document.querySelector("[data-checkout]").disabled = cart.length === 0;

  const bar = document.querySelector("[data-order-bar]");
  bar.hidden = count === 0;
  document.body.classList.toggle("has-order-bar", count > 0);

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="drawer-empty">
        ${donutSVG({ glaze: "#F7E9EE", sprinkles: false })}
        <p>Seu pedido está vazio.<br>Que tal escolher um donut?</p>
      </div>`;
    return;
  }

  itemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-line" data-id="${escapeHTML(item.id)}">
        <div>
          <div class="cart-line-name">${escapeHTML(item.name)}</div>
          <div class="cart-line-unit">${formatBRL(item.price)} cada</div>
        </div>
        <div class="cart-line-sub">${formatBRL(item.price * item.qty)}</div>
        <div class="qty">
          <button type="button" data-action="dec" aria-label="Diminuir ${escapeHTML(item.name)}">&minus;</button>
          <span aria-live="polite">${item.qty}</span>
          <button type="button" data-action="inc" aria-label="Aumentar ${escapeHTML(item.name)}">+</button>
        </div>
        <button class="link-btn" type="button" data-action="remove">remover</button>
      </div>`
    )
    .join("");
}

/* ---------- gaveta ---------- */
function openCart() {
  lastFocus = document.activeElement;
  const drawer = document.getElementById("cart");
  const overlay = document.querySelector(".drawer-overlay");
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add("is-open"));
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  drawer.focus();
}

function closeCart() {
  const drawer = document.getElementById("cart");
  const overlay = document.querySelector(".drawer-overlay");
  if (!drawer.classList.contains("is-open")) return;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.classList.remove("is-open");
  setTimeout(() => (overlay.hidden = true), 250);
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

/* ---------- WhatsApp ---------- */
function buildMessage() {
  const lines = ["Olá, Bem Querer! Gostaria de fazer o seguinte pedido:", ""];
  cart.forEach((item) => lines.push(`• ${item.qty}x ${item.name} — ${formatBRL(item.price * item.qty)}`));
  lines.push("", `Total: ${formatBRL(cartTotal())}`);
  return lines.join("\n");
}

function checkout() {
  if (cart.length === 0) return;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
  window.open(url, "_blank", "noopener");
}

/* ---------- toast ---------- */
let toastTimer;
function showToast(text) {
  const el = document.querySelector("[data-toast]");
  el.textContent = text;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 1800);
}

/* ---------- início ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderFeatured();
  renderFilters();
  renderProducts();
  renderCart();

  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".btn-add");
    if (addBtn) {
      const card = addBtn.closest(".product-card");
      addToCart(card.dataset.id, card.dataset.name, parseFloat(card.dataset.price));
      const label = addBtn.textContent;
      addBtn.textContent = "Adicionado!";
      addBtn.classList.add("is-added");
      setTimeout(() => {
        addBtn.textContent = label;
        addBtn.classList.remove("is-added");
      }, 1100);
      return;
    }
    if (e.target.closest("[data-open-cart]")) openCart();
    if (e.target.closest("[data-close-cart]")) closeCart();
  });

  document.querySelector("[data-cart-items]").addEventListener("click", (e) => {
    const line = e.target.closest(".cart-line");
    const action = e.target.closest("[data-action]");
    if (!line || !action) return;
    const id = line.dataset.id;
    if (action.dataset.action === "inc") changeQty(id, 1);
    if (action.dataset.action === "dec") changeQty(id, -1);
    if (action.dataset.action === "remove") removeItem(id);
  });

  document.querySelector("[data-checkout]").addEventListener("click", checkout);

  document.addEventListener("keydown", (e) => {
    const drawer = document.getElementById("cart");
    if (!drawer.classList.contains("is-open")) return;
    if (e.key === "Escape") closeCart();
    if (e.key === "Tab") {
      const focusables = drawer.querySelectorAll("button:not([disabled])");
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
});
