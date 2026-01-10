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

// TMDB API

const API_KEY = "773440d116b4d5c6ce220f800d3aa8e0"; // Your API key
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

// Total pages you want to load at once
const TOTAL_PAGES = 3; // 3 pages × 20 movies = 60 movies

// ---------------------------
// LOAD MULTIPLE PAGES OF POPULAR MOVIES
// ---------------------------
async function loadPopularMovies(totalPages = TOTAL_PAGES) {
  try {
    const allMovies = [];

    for (let page = 1; page <= totalPages; page++) {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
      );
      const data = await res.json();
      allMovies.push(...data.results);
    }

    renderPopularMovies(allMovies);
  } catch (err) {
    console.error("Failed to load popular movies:", err);
  }
}

// ---------------------------
// RENDER MOVIES GRID
// ---------------------------
function renderPopularMovies(movies) {
  const grid = document.getElementById("popularGrid");
  if (!grid) return;
  grid.innerHTML = ""; // Clear previous

  movies.forEach((movie) => {
    const poster = movie.poster_path
      ? IMG_BASE + movie.poster_path
      : "https://via.placeholder.com/500x750?text=No+Image";

    grid.innerHTML += `
      <div class="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
        <img
          src="${poster}"
          alt="${movie.title}"
          class="w-full aspect-[2/3] object-cover"
        />
        <div class="p-4">
          <h3 class="font-bold text-sm mb-1 text-gray-800 dark:text-white">
            ${movie.title}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 mb-2">
            ${movie.overview || "No description available."}
          </p>
          <span class="text-yellow-400 font-semibold text-sm">
            ${movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    `;
  });
}

// ---------------------------
// INITIAL LOAD
// ---------------------------
loadPopularMovies();