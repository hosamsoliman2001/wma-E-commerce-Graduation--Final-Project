(function () {
  const productsContainer = document.getElementById("productsContainer");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  let localProducts = JSON.parse(localStorage.getItem("products")) || [];
  let apiProducts = [];

  function mergeAndShow() {
    const products = (apiProducts || []).concat(localProducts || []);
    displayProducts(products);
    loadCategories(products);
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
      card.innerHTML = `
        <img src="${p.image || "https://via.placeholder.com/150"}" alt="${escapeHtml(p.title)}" />
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

  fetch("https://fakestoreapi.com/products")
    .then(r => r.json())
    .then(data => { apiProducts = data; mergeAndShow(); })
    .catch(err => { console.error("API error", err); mergeAndShow(); });

  searchInput.addEventListener("input", () => filterProducts());
  categoryFilter.addEventListener("change", () => filterProducts());

  function filterProducts() {
    const term = searchInput.value.toLowerCase();
    const cat = categoryFilter.value;
    const all = (apiProducts || []).concat(localProducts || []);
    let filtered = all;
    if (term) filtered = filtered.filter(p => p.title.toLowerCase().includes(term));
    if (cat !== "all") filtered = filtered.filter(p => p.category === cat);
    displayProducts(filtered);
  }

  function addToCart(id) {
    const all = (apiProducts || []).concat(localProducts || []);
    const prod = all.find(p => String(p.id) === String(id));
    if (!prod) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(i => String(i.id) === String(prod.id));
    if (existing) existing.qty++;
    else cart.push({ id: prod.id, title: prod.title, price: prod.price, image: prod.image, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ تمت إضافة المنتج للعربة!");
    if (typeof window.updateCartCount === "function") window.updateCartCount();
  }

  function escapeHtml(s) {
    return s ? s.replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m])) : "";
  }
})();
