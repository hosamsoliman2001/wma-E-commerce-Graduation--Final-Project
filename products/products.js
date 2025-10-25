(function () {
  const productsContainer = document.getElementById("productsContainer");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const productsCountEl = document.getElementById("productsCount");

  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150?text=No+Image";

  function resolveImage(src) {
    if (!src) return null;
    const cleaned = String(src).trim();
    if (!cleaned) return null;
    if (/^(https?:)?\/\//i.test(cleaned) || cleaned.startsWith("data:")) {
      return cleaned;
    }
    return cleaned.startsWith("/") ? cleaned : `/images/${cleaned}`;
  }

  function normalizeProduct(raw) {
    if (!raw) return null;
    const priceNumber = Number(raw.price || raw.price === 0 ? raw.price : 0);
    return {
      id: raw.id ?? raw._id ?? Date.now(),
      title: raw.title || raw.name || "منتج",
      price: Number.isNaN(priceNumber) ? 0 : priceNumber,
      image: resolveImage(raw.image || raw.thumbnail) || null,
      category: typeof raw.category === "object" && raw.category ? raw.category.name : raw.category || null
    };
  }

  let localProducts = JSON.parse(localStorage.getItem("products")) || [];
  if (!Array.isArray(localProducts)) localProducts = [];
  localProducts = localProducts.map(normalizeProduct).filter(Boolean);

  let apiProducts = [];

  function mergeAndShow() {
    const products = [...apiProducts, ...localProducts];
    displayProducts(products);
    loadCategories(products);
    if (productsCountEl) {
      productsCountEl.textContent = products.length;
    }
  }

  function displayProducts(list) {
    productsContainer.innerHTML = "";
    if (!list.length) {
      productsContainer.innerHTML = "<p style='text-align:center'>⚠️ لا توجد منتجات.</p>";
      return;
    }
    list.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      const imgSrc = p.image || PLACEHOLDER_IMAGE;
      card.innerHTML = `
        <img src="${imgSrc}" alt="${escapeHtml(p.title)}" />
        <h3>${escapeHtml(p.title)}</h3>
        <p>${Number(p.price).toFixed(2)} $</p>
        <button data-id="${p.id}">🛒 أضف للعربة</button>
      `;
      card.querySelector("button").addEventListener("click", () => addToCart(p.id));
      productsContainer.appendChild(card);
    });
  }

  function loadCategories(list) {
    const cats = Array.from(new Set(list.map(p => p.category).filter(Boolean)));
    categoryFilter.innerHTML = '<option value="all">كل الفئات</option>';
    cats.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      categoryFilter.appendChild(opt);
    });
  }

  fetch("/api/v1/products?limit=100")
    .then(r => r.json())
    .then(data => {
      const items = Array.isArray(data?.items) ? data.items : [];
      apiProducts = items.map(normalizeProduct).filter(Boolean);
      mergeAndShow();
    })
    .catch(err => {
      console.error("API error", err);
      apiProducts = [];
      mergeAndShow();
    });

  searchInput.addEventListener("input", () => filterProducts());
  categoryFilter.addEventListener("change", () => filterProducts());

  function filterProducts() {
    const term = searchInput.value.toLowerCase();
    const cat = categoryFilter.value;
    const all = [...apiProducts, ...localProducts];
    let filtered = all;
    if (term) filtered = filtered.filter(p => p.title.toLowerCase().includes(term));
    if (cat !== "all") filtered = filtered.filter(p => p.category === cat);
    displayProducts(filtered);
    if (productsCountEl) {
      productsCountEl.textContent = filtered.length;
    }
  }

  function addToCart(id) {
    const all = [...apiProducts, ...localProducts];
    const prod = all.find(p => String(p.id) === String(id));
    if (!prod) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!Array.isArray(cart)) cart = [];
    const existing = cart.find(i => String(i.id) === String(prod.id));
    if (existing) existing.qty++;
    else cart.push({ id: prod.id, title: prod.title, price: prod.price, image: prod.image || PLACEHOLDER_IMAGE, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ تمت إضافة المنتج للعربة!");
    if (typeof window.updateCartCount === "function") window.updateCartCount();
  }

  function escapeHtml(s) {
    return s ? s.replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m])) : "";
  }
})();
