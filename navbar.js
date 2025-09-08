(function(){
  function getPrefix(){
    const path=window.location.pathname.replace(/\\/g,"/");
    if(path.includes("/products/")||path.includes("/cart/")||path.includes("/admin/")||path.includes("/auth/")) return "../";
    return "";
  }
  function buildNavbar(){
    const navbarLinks=document.getElementById("navbarLinks"); if(!navbarLinks)return;
    const prefix=getPrefix(); const currentUser=JSON.parse(localStorage.getItem("currentUser"));
    const logoArea=`
      <div class="logo-container" onclick="window.location.href='${prefix}index.html'">
        <img src="${prefix}assets/logo.png" class="logo-small"/>
        <span class="brand-name">WMA</span>
        ${currentUser?`<span class="welcome">مرحباً، ${escapeHtml(currentUser.username)}</span>`:""}
      </div>`;
    let links=`
      <a href="${prefix}products/products.html">المنتجات</a>
      <a href="${prefix}cart/cart.html">عربة (<span id="cartCount">0</span>)</a>
      <a href="${prefix}admin/admin.html">الإدارة</a>
      <a href="${prefix}cart/orders.html">الطلبات</a>
      <button id="themeToggle">🌙</button>`;
    links=currentUser?`<button id="logoutBtn">خروج</button>`+links:`<a href="${prefix}auth/auth.html">الدخول</a>`+links;
    navbarLinks.innerHTML=logoArea+`<div class="nav-links">${links}</div>`;
    const logout=document.getElementById("logoutBtn");
    if(logout)logout.addEventListener("click",()=>{localStorage.removeItem("currentUser");window.location.href=prefix+"index.html"});
    updateCartCount();
  }
  window.updateCartCount=function(){const cart=JSON.parse(localStorage.getItem("cart"))||[];const total=cart.reduce((s,i)=>s+(i.qty||0),0);const el=document.getElementById("cartCount");if(el)el.textContent=total;}
  function escapeHtml(s){return s?String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])):"";}
  document.addEventListener("DOMContentLoaded",buildNavbar);
})();
