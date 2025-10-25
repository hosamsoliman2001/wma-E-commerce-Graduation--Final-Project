(function () {
  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/50?text=No+Image";

  const productsTableBody = document.querySelector("#productsTable tbody");
  const ordersTableBody = document.querySelector("#ordersTable tbody");
  const productForm = document.getElementById("productForm");
  const categorySelect = document.getElementById("categorySelect");
  const formMessage = document.getElementById("productFormMessage");

  const totalSalesEl = document.getElementById("totalSales");
  const totalProductsEl = document.getElementById("totalProducts");
  const totalUsersEl = document.getElementById("totalUsers");

  let authToken = null;
  let products = [];
  let categories = [];

  function ensureAuth() {
    if (!authToken) {
      throw new Error("يرجى إعادة تسجيل الدخول كمشرف.");
    }
  }

  function buildAuthHeaders(extra = {}) {
    ensureAuth();
    return { Authorization: `Bearer ${authToken}`, ...extra };
  }

  function getImageSource(product) {
    return product.image || product.imageUrl || PLACEHOLDER_IMAGE;
  }

  function escapeHtml(str) {
    return str
      ? String(str).replace(/[&<>"']/g, (m) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        })[m])
      : "";
  }

  function formatPrice(value) {
    const num = Number(value);
    return Number.isFinite(num) ? `${num.toFixed(2)} $` : "-";
  }

  function showFormMessage(msg, type = "success") {
    if (!formMessage) return;
    formMessage.textContent = msg;
    formMessage.className = `form-message ${type}`;
  }

  function clearFormMessage() {
    if (!formMessage) return;
    formMessage.textContent = "";
    formMessage.className = "form-message";
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/v1/categories");
      if (!res.ok) {
        throw new Error(`فشل تحميل الفئات (${res.status})`);
      }
      categories = await res.json();
      populateCategorySelect();
    } catch (error) {
      console.error("Category fetch error", error);
      showFormMessage("تعذر تحميل الفئات.", "error");
    }
  }

  async function handleDeleteProduct(product) {
    clearFormMessage();
    if (!window.confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟`)) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/products/${product.id}`, {
        method: "DELETE",
        headers: buildAuthHeaders()
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const message = errorBody?.message || `فشل حذف المنتج (${res.status})`;
        throw new Error(message);
      }
      showFormMessage("🗑️ تم حذف المنتج.", "success");
      await fetchProducts();
    } catch (error) {
      console.error("Delete product error", error);
      showFormMessage(error.message || "تعذر حذف المنتج.", "error");
    }
  }

  async function handleEditProduct(product) {
    clearFormMessage();
    const currentPrice = Number(product.price);
    const currentStock = Number.isFinite(Number(product.stock)) ? Number(product.stock) : "";
    const currentImage = product.image || product.imageUrl || "";
    const currentCategoryId = product.category?.id || product.categoryId || "";

    const nameInput = prompt("اسم المنتج:", product.name || "");
    if (nameInput === null) return;

    const priceInput = prompt("السعر:", Number.isFinite(currentPrice) ? currentPrice : "");
    if (priceInput === null) return;

    const stockInput = prompt("المخزون (اتركه فارغاً بدون تغيير):", currentStock !== "" ? currentStock : "");
    if (stockInput === null) return;

    const imageInput = prompt("رابط الصورة:", currentImage);
    if (imageInput === null) return;

    const categoryList = categories.map((cat) => `${cat.name} ➜ ${cat.id}`).join("\n");
    const categoryPrompt = prompt(
      `معرف الفئة (اتركه فارغاً بدون تغيير)\n${categoryList}`,
      currentCategoryId
    );
    if (categoryPrompt === null) return;

    const descriptionInput = prompt("الوصف:", product.description || "");
    if (descriptionInput === null) return;

    const updates = {};
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      showFormMessage("الاسم لا يمكن أن يكون فارغاً.", "error");
      return;
    }
    if (trimmedName !== product.name) {
      updates.name = trimmedName;
    }

    const parsedPrice = Number(priceInput);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      showFormMessage("قيمة السعر غير صحيحة.", "error");
      return;
    }
    if (!Number.isNaN(currentPrice) && parsedPrice !== currentPrice) {
      updates.price = parsedPrice;
    }

    if (stockInput !== "") {
      const parsedStock = Number(stockInput);
      if (!Number.isFinite(parsedStock) || parsedStock < 0) {
        showFormMessage("قيمة المخزون غير صحيحة.", "error");
        return;
      }
      if (parsedStock !== Number(product.stock)) {
        updates.stock = parsedStock;
      }
    }

    const trimmedImage = imageInput.trim();
    if (!trimmedImage) {
      showFormMessage("رابط الصورة لا يمكن أن يكون فارغاً.", "error");
      return;
    }
    if (trimmedImage !== currentImage) {
      updates.imageUrl = trimmedImage;
    }

    const trimmedCategory = categoryPrompt.trim();
    if (trimmedCategory && trimmedCategory !== currentCategoryId) {
      updates.categoryId = trimmedCategory;
    }

    const trimmedDescription = descriptionInput.trim();
    if (trimmedDescription !== (product.description || "")) {
      updates.description = trimmedDescription || null;
    }

    if (Object.keys(updates).length === 0) {
      showFormMessage("لم يتم إجراء أي تعديل.", "info");
      return;
    }

    try {
      const res = await fetch(`/api/v1/products/${product.id}`, {
        method: "PUT",
        headers: buildAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(updates)
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const message = errorBody?.message || `فشل تعديل المنتج (${res.status})`;
        throw new Error(message);
      }

      showFormMessage("✏️ تم تعديل المنتج.", "success");
      await fetchProducts();
    } catch (error) {
      console.error("Update product error", error);
      showFormMessage(error.message || "تعذر تعديل المنتج.", "error");
    }
  }

  function populateCategorySelect() {
    if (!categorySelect) return;
    const valueBefore = categorySelect.value;
    categorySelect.innerHTML = '<option value="">اختر الفئة</option>';
    categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = cat.name;
      categorySelect.appendChild(opt);
    });
    if (valueBefore) {
      categorySelect.value = valueBefore;
    }
  }

  async function fetchProducts() {
    try {
      const res = await fetch("/api/v1/products?limit=100");
      if (!res.ok) {
        throw new Error(`فشل تحميل المنتجات (${res.status})`);
      }
      const data = await res.json();
      products = Array.isArray(data?.items) ? data.items : [];
      renderProducts();
      updateTotals();
    } catch (error) {
      console.error("Products fetch error", error);
      showFormMessage("تعذر تحميل المنتجات.", "error");
    }
  }

  function renderProducts() {
    if (!productsTableBody) return;
    productsTableBody.innerHTML = "";
    if (!products.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 6;
      td.textContent = "لا توجد منتجات";
      tr.appendChild(td);
      productsTableBody.appendChild(tr);
      return;
    }

    products.forEach((product) => {
      const tr = document.createElement("tr");
      const imgCell = document.createElement("td");
      const img = document.createElement("img");
      img.src = getImageSource(product);
      img.referrerPolicy = "no-referrer";
      img.alt = product.name || "";
      imgCell.appendChild(img);

      const nameCell = document.createElement("td");
      nameCell.textContent = product.name || "-";

      const priceCell = document.createElement("td");
      priceCell.textContent = formatPrice(product.price);

      const categoryCell = document.createElement("td");
      categoryCell.textContent = product.category?.name || product.categoryName || "-";

      const stockCell = document.createElement("td");
      stockCell.textContent = product.stock ?? "-";

      const actionsCell = document.createElement("td");
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "action-btn";
      editBtn.textContent = "✏️ تعديل";
      editBtn.addEventListener("click", () => handleEditProduct(product));

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "action-btn danger";
      deleteBtn.textContent = "🗑 حذف";
      deleteBtn.addEventListener("click", () => handleDeleteProduct(product));

      actionsCell.append(editBtn, deleteBtn);

      tr.append(imgCell, nameCell, priceCell, categoryCell, stockCell, actionsCell);
      productsTableBody.appendChild(tr);
    });
  }

  function loadOrdersFromStorage() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    if (!ordersTableBody) return;
    ordersTableBody.innerHTML = "";
    orders.forEach((order) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(order.userEmail)}</td>
        <td>${order.items.map((i) => `${escapeHtml(i.title)} (x${i.qty})`).join(", ")}</td>
        <td>${order.createdAt || "-"}</td>
      `;
      ordersTableBody.appendChild(tr);
    });
    return orders;
  }

  function updateTotals() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const totalSales = orders.reduce((sum, order) => {
      return (
        sum +
        order.items.reduce((orderSum, item) => orderSum + (item.price || 0) * (item.qty || 0), 0)
      );
    }, 0);

    totalSalesEl.textContent = `${totalSales.toFixed(2)} $`;
    totalProductsEl.textContent = products.length;
    totalUsersEl.textContent = users.length;
  }

  async function handleProductSubmit(event) {
    event.preventDefault();
    clearFormMessage();

    if (!authToken) {
      showFormMessage("يرجى إعادة تسجيل الدخول كمشرف.", "error");
      return;
    }

    const formData = new FormData(productForm);
    const payload = {
      name: formData.get("name")?.trim(),
      price: Number(formData.get("price")),
      stock: formData.get("stock") ? Number(formData.get("stock")) : undefined,
      categoryId: formData.get("categoryId"),
      description: formData.get("description")?.trim() || undefined,
      imageUrl: formData.get("imageUrl")?.trim()
    };

    if (!payload.name || !payload.categoryId || !payload.imageUrl || !Number.isFinite(payload.price)) {
      showFormMessage("الرجاء تعبئة الحقول المطلوبة بشكل صحيح.", "error");
      return;
    }

    if (payload.stock !== undefined && !Number.isFinite(payload.stock)) {
      showFormMessage("قيمة المخزون غير صحيحة.", "error");
      return;
    }

    try {
      const res = await fetch("/api/v1/products", {
        method: "POST",
        headers: buildAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const message = errorBody?.message || `فشل إنشاء المنتج (${res.status})`;
        throw new Error(message);
      }

      await res.json();
      showFormMessage("✅ تم إضافة المنتج بنجاح.", "success");
      productForm.reset();
      if (categorySelect) categorySelect.value = "";
      await fetchProducts();
    } catch (error) {
      console.error("Create product error", error);
      showFormMessage(error.message || "حدث خطأ أثناء إضافة المنتج.", "error");
    }
  }

  async function initialize() {
    const currentUserRaw = localStorage.getItem("currentUser");
    const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
    authToken = localStorage.getItem("authToken");

    if (!currentUser || !currentUser.isAdmin || !authToken) {
      alert("⚠️ الوصول للمشرفين فقط. يرجى تسجيل الدخول.");
      window.location.href = "../auth/auth.html";
      return;
    }

    loadOrdersFromStorage();
    updateTotals();

    await Promise.all([fetchCategories(), fetchProducts()]);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (productForm) {
      productForm.addEventListener("submit", handleProductSubmit);
    }
    initialize();
  });
})();

