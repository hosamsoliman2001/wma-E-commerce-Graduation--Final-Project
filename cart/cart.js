(function () {
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const clearBtn = document.getElementById("clearCart");
  const loginReminder = document.getElementById("loginReminder");

  function escapeHtml(s) {
    return s ? String(s).replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    }[m])) : "";
  }

  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartUI() {
    renderCart();
    if (typeof window.updateCartCount === "function") {
      window.updateCartCount();
    }
  }

  function renderCart() {
    const cart = getCart();
    cartItemsEl.innerHTML = "";
    if (!cart.length) {
      cartItemsEl.innerHTML = "<p style='text-align:center'>⚠️ العربة فارغة.</p>";
      cartTotalEl.textContent = "0";
      return;
    }

    let total = 0;
    cart.forEach(item => {
      total += item.price * item.qty;
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="${item.image || "https://via.placeholder.com/90"}" alt="${escapeHtml(item.title)}" />
        <div class="cart-item-details">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${item.price.toFixed(2)} $</p>
        </div>
        <div class="qty-controls">
          <button class="dec">-</button>
          <span>${item.qty}</span>
          <button class="inc">+</button>
        </div>
      `;
      div.querySelector(".inc").addEventListener("click", () => changeQty(item.id, 1));
      div.querySelector(".dec").addEventListener("click", () => changeQty(item.id, -1));
      cartItemsEl.appendChild(div);
    });

    cartTotalEl.textContent = total.toFixed(2);
  }

  function changeQty(id, delta) {
    let cart = getCart();
    const item = cart.find(i => String(i.id) === String(id));
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => String(i.id) !== String(id));
    saveCart(cart);
    updateCartUI();
  }

  checkoutBtn.addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) return alert("⚠️ العربة فارغة.");

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("⚠️ يجب تسجيل الدخول أولاً لإتمام الشراء.");
      window.location.href = "../auth/auth.html";
      return;
    }

    // إتمام الشراء
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push({
      userEmail: currentUser.email,
      items: cart,
      createdAt: new Date().toLocaleString()
    });
    localStorage.setItem("orders", JSON.stringify(orders));

    alert("✅ تم إتمام الشراء بنجاح!");
    saveCart([]);
    updateCartUI();
  });

  clearBtn.addEventListener("click", () => {
    saveCart([]);
    updateCartUI();
  });

  document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) loginReminder.classList.remove("hidden");
    renderCart();
  });
})();
