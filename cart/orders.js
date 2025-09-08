(function () {
  const ordersList = document.getElementById("ordersList");

  function escapeHtml(s) {
    return s ? String(s).replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    }[m])) : "";
  }

  function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
  }

  function displayOrders() {
    const orders = getOrders();
    ordersList.innerHTML = "";

    if (orders.length === 0) {
      ordersList.innerHTML = "<p style='text-align:center'>لا توجد طلبات بعد.</p>";
      return;
    }

    orders.forEach((order, idx) => {
      const div = document.createElement("div");
      div.className = "order-card";
      div.innerHTML = `
        <h3>طلب رقم: ${idx + 1}</h3>
        <p><strong>البريد:</strong> ${escapeHtml(order.userEmail || "غير محدد")}</p>
        <p><strong>التاريخ:</strong> ${escapeHtml(order.createdAt || "")}</p>
        <ul>
          ${order.items.map(item => `
            <li>${escapeHtml(item.title)} - ${item.qty} × ${item.price}$</li>
          `).join("")}
        </ul>
      `;
      ordersList.appendChild(div);
    });
  }

  document.addEventListener("DOMContentLoaded", displayOrders);
})();
