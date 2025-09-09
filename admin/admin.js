(function () {
  const productsTable = document.querySelector("#productsTable tbody");
  const ordersTable = document.querySelector("#ordersTable tbody");
  const addProductBtn = document.getElementById("addProductBtn");

  const totalSalesEl = document.getElementById("totalSales");
  const totalProductsEl = document.getElementById("totalProducts");
  const totalUsersEl = document.getElementById("totalUsers");

  function loadStats() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // إجمالي المبيعات
    let sales = 0;
    orders.forEach(o => {
      o.items.forEach(i => { sales += i.price * i.qty; });
    });

    totalSalesEl.textContent = sales.toFixed(2) + " $";
    totalProductsEl.textContent = products.length;
    totalUsersEl.textContent = users.length;
  }

  function loadProducts() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    productsTable.innerHTML = "";
    products.forEach((p, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="${p.image || "https://via.placeholder.com/50"}"></td>
        <td>${escapeHtml(p.title)}</td>
        <td>${p.price.toFixed(2)} $</td>
        <td>${p.category || "-"}</td>
        <td>
          <button class="action-btn danger" data-idx="${idx}">🗑 حذف</button>
        </td>
      `;
      tr.querySelector("button").addEventListener("click", () => deleteProduct(idx));
      productsTable.appendChild(tr);
    });
  }
function loadProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  productsTable.innerHTML = "";
  products.forEach((p, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${p.image || "https://via.placeholder.com/50"}"></td>
      <td>${escapeHtml(p.title)}</td>
      <td>${p.price.toFixed(2)} $</td>
      <td>${p.category || "-"}</td>
      <td>
        <button class="action-btn" data-edit="${idx}">✏️ تعديل</button>
        <button class="action-btn danger" data-del="${idx}">🗑 حذف</button>
      </td>
    `;

    // زر التعديل
    tr.querySelector("[data-edit]").addEventListener("click", () => editProduct(idx));

    // زر الحذف
    tr.querySelector("[data-del]").addEventListener("click", () => deleteProduct(idx));

    productsTable.appendChild(tr);
  });
}

function editProduct(idx) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let product = products[idx];

  const newTitle = prompt("اسم المنتج:", product.title);
  const newPrice = parseFloat(prompt("السعر:", product.price));
  const newImage = prompt("رابط الصورة:", product.image);
  const newCategory = prompt("الفئة:", product.category);

  if (!newTitle || isNaN(newPrice)) {
    return alert("⚠️ بيانات غير صحيحة");
  }

  products[idx] = {
    ...product,
    title: newTitle,
    price: newPrice,
    image: newImage,
    category: newCategory
  };

  localStorage.setItem("products", JSON.stringify(products));
  loadProducts();
  loadStats();
}
  function loadOrders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    ordersTable.innerHTML = "";
    orders.forEach(o => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(o.userEmail)}</td>
        <td>${o.items.map(i => escapeHtml(i.title) + " (x" + i.qty + ")").join(", ")}</td>
        <td>${o.createdAt}</td>
      `;
      ordersTable.appendChild(tr);
    });
  }

  function deleteProduct(idx) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.splice(idx, 1);
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
    loadStats();
  }

  addProductBtn.addEventListener("click", () => {
    const title = prompt("اسم المنتج:");
    const price = parseFloat(prompt("السعر:"));
    const image = prompt("رابط الصورة:");
    const category = prompt("الفئة:");
    if (!title || isNaN(price)) return alert("⚠️ بيانات غير صحيحة");

    let products = JSON.parse(localStorage.getItem("products")) || [];
    const newProd = { id: Date.now(), title, price, image, category };
    products.push(newProd);
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
    loadStats();
  });

  function escapeHtml(str) {
    return str ? String(str).replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    }[m])) : "";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || !user.isAdmin) {
      alert("⚠️ الوصول للمشرفين فقط");
      window.location.href = "../index.html";
      return;
    }
    loadStats();
    loadProducts();
    loadOrders();
  });
})();
