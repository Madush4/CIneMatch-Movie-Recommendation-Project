const toggleInput = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;
const sliderIcon = document.querySelector(".slider-icon");

const savedTheme = localStorage.getItem("theme") || "light";

function applyTheme(theme) {
  if (theme === "dark") {
    htmlElement.classList.add("dark");
    toggleInput.checked = true;
    sliderIcon.textContent = "🌙";
  } else {
    htmlElement.classList.remove("dark");
    toggleInput.checked = false;
    sliderIcon.textContent = "☀️";
  }
  localStorage.setItem("theme", theme);
}

applyTheme(savedTheme);

toggleInput.addEventListener("change", () => {
  const newTheme = toggleInput.checked ? "dark" : "light";
  applyTheme(newTheme);
});
