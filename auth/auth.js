// auth.js - إدارة تسجيل الدخول والتسجيل عبر واجهة الـ API
(function () {
  const API_BASE = "/api/v1";

  function storeSession(token, user) {
    if (!token || !user) return;
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: Boolean(user.isAdmin)
    };
    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(safeUser));
  }

  function handleError(error) {
    const message = error?.message || "حدث خطأ غير متوقع";
    alert(`⚠️ ${message}`);
  }

  function withLoading(button, action) {
    if (!button) return action();
    if (button.dataset.loading === "true") return;
    const originalText = button.textContent;
    button.dataset.loading = "true";
    button.disabled = true;
    button.textContent = "...";
    return action()
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        delete button.dataset.loading;
        button.disabled = false;
        button.textContent = originalText;
      });
  }

  async function apiRequest(path, options) {
    const res = await fetch(`${API_BASE}${path}`, options);
    if (!res.ok) {
      let body;
      try {
        body = await res.json();
      } catch (_err) {
        body = null;
      }
      const message = body?.message || `فشل الطلب (${res.status})`;
      throw new Error(message);
    }
    return res.json();
  }

  function redirectToProducts() {
    window.location.href = "/products/products.html";
  }

  function redirectToAdmin() {
    window.location.href = "/admin/admin.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const loginBox = document.getElementById("loginBox");
    const registerBox = document.getElementById("registerBox");

    if (!loginBox || !registerBox) {
      return;
    }

    const showRegister = document.getElementById("showRegister");
    const showLogin = document.getElementById("showLogin");
    const registerBtn = document.getElementById("registerBtn");
    const loginBtn = document.getElementById("loginBtn");
    const authBox = document.getElementById("authBox");
    const showBtn = document.getElementById("showBtn");
    const adminLoginBtn = document.getElementById("adminLoginBtn");

    if (showRegister) {
      showRegister.addEventListener("click", (e) => {
        e.preventDefault();
        loginBox.style.display = "none";
        registerBox.style.display = "block";
      });
    }

    if (showLogin) {
      showLogin.addEventListener("click", (e) => {
        e.preventDefault();
        registerBox.style.display = "none";
        loginBox.style.display = "block";
      });
    }

    if (registerBtn) {
      registerBtn.addEventListener("click", () => {
        withLoading(registerBtn, async () => {
          const username = document.getElementById("regName").value.trim();
          const email = document.getElementById("regEmail").value.trim();
          const password = document.getElementById("regPass").value;

          if (!username || !email || !password) {
            throw new Error("الرجاء تعبئة جميع الحقول المطلوبة");
          }

          const result = await apiRequest("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
          });

          storeSession(result.token, result.user);
          alert("✅ تم التسجيل بنجاح! سيتم تحويلك للمنتجات.");
          redirectToProducts();
        }).catch(handleError);
      });
    }

    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        withLoading(loginBtn, async () => {
          const email = document.getElementById("loginEmail").value.trim();
          const password = document.getElementById("loginPassword").value;

          if (!email || !password) {
            throw new Error("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
          }

          const result = await apiRequest("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });

          storeSession(result.token, result.user);
          alert("✅ تم تسجيل الدخول!");
          redirectToProducts();
        }).catch(handleError);
      });
    }

    if (showBtn && authBox) {
      showBtn.addEventListener("click", () => {
        authBox.style.display = "block";
        showBtn.style.display = "none";
      });
    }

    if (adminLoginBtn) {
      adminLoginBtn.addEventListener("click", () => {
        withLoading(adminLoginBtn, async () => {
          const email = document.getElementById("adminEmail").value.trim();
          const password = document.getElementById("adminPass").value;

          if (!email || !password) {
            throw new Error("الرجاء إدخال بيانات المشرف");
          }

          const result = await apiRequest("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });

          if (!result.user?.isAdmin) {
            throw new Error("هذا الحساب ليس حساب مشرف");
          }

          storeSession(result.token, result.user);
          alert("✅ تم تسجيل الدخول كمشرف!");
          redirectToAdmin();
        }).catch(handleError);
      });
    }
  });
})();

