// auth.js - إدارة تسجيل الدخول والتسجيل
(function () {
  const usersKey = "users";
  let users = JSON.parse(localStorage.getItem(usersKey)) || [];

  // ✅ إنشاء حساب المشرف تلقائياً لو مش موجود
  if (!users.find(u => u.email === "admin@wma.com")) {
    users.push({
      username: "admin",
      email: "admin@wma.com",
      password: "123456",
      isAdmin: true
    });
    localStorage.setItem(usersKey, JSON.stringify(users));
  }

  const loginBox = document.getElementById("loginBox");
  const registerBox = document.getElementById("registerBox");

  // ✅ التنقل بين النماذج
  document.getElementById("showRegister").addEventListener("click", e => {
    e.preventDefault();
    loginBox.style.display = "none";
    registerBox.style.display = "block";
  });

  document.getElementById("showLogin").addEventListener("click", e => {
    e.preventDefault();
    registerBox.style.display = "none";
    loginBox.style.display = "block";
  });

  // ✅ تسجيل حساب جديد
  document.getElementById("registerBtn").addEventListener("click", () => {
    const username = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPass").value;

    if (!username || !email || !password) {
      alert("⚠️ الرجاء تعبئة كل الحقول");
      return;
    }

    users = JSON.parse(localStorage.getItem(usersKey)) || [];
    if (users.find(u => u.email === email)) {
      alert("⚠️ هذا البريد مستخدم بالفعل");
      return;
    }

    const newUser = { username, email, password, isAdmin: false };
    users.push(newUser);
    localStorage.setItem(usersKey, JSON.stringify(users));

    alert("✅ تم التسجيل! يمكنك الآن تسجيل الدخول");
    registerBox.style.display = "none";
    loginBox.style.display = "block";
  });

  // ✅ تسجيل الدخول كمستخدم
  document.getElementById("loginBtn").addEventListener("click", () => {
    const ident = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value;

    users = JSON.parse(localStorage.getItem(usersKey)) || [];
    const user = users.find(
      u => (u.email === ident || u.username === ident) && u.password === pass
    );

    if (!user) {
      alert("⚠️ بيانات غير صحيحة");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "../products/products.html";
  });

  // ✅ تسجيل الدخول كمشرف مباشرة
  document.getElementById("adminLoginBtn").addEventListener("click", () => {
    const adminUser = {
      username: "admin",
      email: "admin@wma.com",
      password: "123456",
      isAdmin: true
    };

    localStorage.setItem("currentUser", JSON.stringify(adminUser));
    alert("✅ تم تسجيل الدخول كمشرف!");
    window.location.href = "../admin/admin.html";
  });
})();
