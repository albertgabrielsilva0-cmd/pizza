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

function productArt(art = {}, label = "") {
  if (art.kind === "drink") {
    const a11y = label ? `role="img" aria-label="${escapeHTML(label)}"` : 'aria-hidden="true"';
    return `<svg class="drink" ${a11y}><use href="#drink" style="--can:${art.color || "#D7141A"}"/></svg>`;
  }
  if (art.kind === "box") {
    return `<div class="box-art" ${label ? `role="img" aria-label="${escapeHTML(label)}"` : 'aria-hidden="true"'}>
      ${donutSVG({ glaze: "#FF7DB5" })}${donutSVG({ glaze: "#4A2618" })}${donutSVG({ glaze: "#FFF8EE", sprinkles: ["#F50078", "#F5A623", "#34B7E8"] })}
    </div>`;
  }
  return donutSVG(art, label);
}

function productMedia(p) {
  return p.image
    ? `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy">`
    : productArt(p.art, p.name);
}

function priceText(p) {
  if (p.priceLabel) return p.priceLabel;
  return p.price > 0 ? formatBRL(p.price) : "Consulte o valor";
}

/* ---------- catálogo ---------- */
function renderFeatured() {
  const el = document.querySelector("[data-featured]");
  if (!el) return;
  el.innerHTML = catalog.products
    .filter((p) => p.featured)
    .map((p) => {
      const art = p.art || {};
      return `
      <a class="featured-card" href="#p-${escapeHTML(p.id)}" style="--card-bg:${art.bg || "var(--bg-alt)"}"${art.dark ? " data-dark" : ""}>
        ${p.image ? `<img class="featured-img" src="${escapeHTML(p.image)}" alt="" loading="lazy">` : productArt(art)}
        <span class="featured-name">${escapeHTML(p.name)}</span>
        <span class="featured-price">${priceText(p)}</span>
        <span class="link-arrow">Ver produto <span aria-hidden="true">→</span></span>
      </a>`;
    })
    .join("");
}

function setFilter(filter) {
  document.querySelectorAll("[data-filters] .chip").forEach((c) => {
    const active = c.dataset.filter === filter;
    c.classList.toggle("is-active", active);
    c.setAttribute("aria-pressed", active);
    if (active) c.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  });
  document.querySelectorAll("[data-products] .menu-group").forEach((group) => {
    group.hidden = filter !== "todos" && group.dataset.category !== filter;
  });
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
    if (chip) setFilter(chip.dataset.filter);
  });
}

function productCard(p) {
  const art = p.art || {};
  return `
      <article class="product-card${p.category === "mini" ? " product-card--mini" : ""}" id="p-${escapeHTML(p.id)}" data-id="${escapeHTML(p.id)}" data-name="${escapeHTML(p.name)}" data-price="${p.price}" data-category="${escapeHTML(p.category)}">
        ${p.tag ? `<span class="tag${art.dark ? " tag--pink" : ""}">${escapeHTML(p.tag)}</span>` : ""}
        <div class="product-media" style="--media-bg:${art.bg || "var(--bg-alt)"}">${productMedia(p)}</div>
        <div class="product-body">
          <h4 class="product-name">${escapeHTML(p.name)}</h4>
          ${p.description ? `<p class="product-desc">${escapeHTML(p.description)}</p>` : ""}
          <div class="product-foot">
            <span class="price${p.price > 0 && !p.priceLabel ? "" : " price--note"}">${escapeHTML(priceText(p))}</span>
            <button class="btn btn-primary btn-add" type="button" aria-label="Adicionar ${escapeHTML(p.name)} ao pedido">Adicionar</button>
          </div>
        </div>
      </article>`;
}

function renderProducts() {
  const el = document.querySelector("[data-products]");
  if (!el) return;
  el.innerHTML = catalog.categories
    .map((c) => {
      const items = catalog.products.filter((p) => p.category === c.id);
      if (!items.length) return "";
      return `
      <section class="menu-group" data-category="${escapeHTML(c.id)}" aria-labelledby="cat-${escapeHTML(c.id)}">
        <h3 class="menu-group-title" id="cat-${escapeHTML(c.id)}">${escapeHTML(c.name)} <span>${items.length}</span></h3>
        <div class="product-grid${c.id === "mini" ? " product-grid--mini" : ""}">${items.map(productCard).join("")}</div>
      </section>`;
    })
    .join("");
}

/* ---------- menu mobile ---------- */
function setMenu(open) {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  if (!toggle || !menu) return;
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  menu.classList.toggle("is-open", open);
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
  showToast("Adicionado ao pedido!");
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
          <div class="cart-line-unit">${item.price > 0 ? `${formatBRL(item.price)} cada` : "valor a confirmar"}</div>
        </div>
        <div class="cart-line-sub">${item.price > 0 ? formatBRL(item.price * item.qty) : "—"}</div>
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
  const lines = ["Olá, Bem Querer Dom Pedro - Ipiranga! Gostaria de fazer o seguinte pedido:", ""];
  cart.forEach((item) => {
    const value = item.price > 0 ? formatBRL(item.price * item.qty) : "valor a confirmar";
    lines.push(`• ${item.qty}x ${item.name} — ${value}`);
  });
  lines.push("", `Total: ${formatBRL(cartTotal())}`);
  if (cart.some((item) => !(item.price > 0))) lines.push("(alguns itens com valor a confirmar)");
  lines.push("", "Entrega ou retirada?");
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
      const cat = catalog.categories.find((c) => c.id === card.dataset.category);
      const name = cat && cat.id !== "caixa" ? `${card.dataset.name} (${cat.name})` : card.dataset.name;
      addToCart(card.dataset.id, name, parseFloat(card.dataset.price));
      const label = addBtn.textContent;
      addBtn.textContent = "Adicionado!";
      addBtn.classList.add("is-added");
      setTimeout(() => {
        addBtn.textContent = label;
        addBtn.classList.remove("is-added");
      }, 1100);
      return;
    }
    if (e.target.closest(".featured-card")) setFilter("todos");
    const toggle = e.target.closest("[data-menu-toggle]");
    if (toggle) setMenu(toggle.getAttribute("aria-expanded") !== "true");
    else if (e.target.closest("[data-menu] a") || !e.target.closest("[data-menu]")) setMenu(false);
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
    if (e.key === "Escape") setMenu(false);
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
