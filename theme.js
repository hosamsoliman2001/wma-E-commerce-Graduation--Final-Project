(function(){
  function init(){
    const btn=document.getElementById("themeToggle"); if(!btn)return;
    if(localStorage.getItem("theme")==="dark"){document.body.classList.add("dark-mode");btn.textContent="☀️";}
    btn.addEventListener("click",()=>{document.body.classList.toggle("dark-mode");
      if(document.body.classList.contains("dark-mode")){localStorage.setItem("theme","dark");btn.textContent="☀️";}
      else{localStorage.setItem("theme","light");btn.textContent="🌙";}});
  }
  document.addEventListener("DOMContentLoaded",()=>setTimeout(init,50));
})();
