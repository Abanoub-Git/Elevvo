const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-btn");
const overlay = document.getElementById("overlay");

toggleBtn.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("active");
    } else {
    sidebar.classList.toggle("closed");
    }
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
});
