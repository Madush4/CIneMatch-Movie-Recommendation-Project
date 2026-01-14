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

const API_KEY = "773440d116b4d5c6ce220f800d3aa8e0";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

const userSelection = {
  age: null,
  genre: null,
  mood: null,
};

function setupSelectableGroup(elements, key) {
  elements.forEach((el) => {
    el.addEventListener("click", () => {
      elements.forEach((btn) =>
        btn.classList.remove(
          "ring-2",
          "ring-rose-500",
          "bg-rose-200",
          "dark:bg-rose-500/20"
        )
      );
      el.classList.add(
        "ring-2",
        "ring-rose-500",
        "bg-rose-200",
        "dark:bg-rose-500/20"
      );

      userSelection[key] = el.textContent.trim();
    });
  });
}

const ageButtons = document.querySelectorAll('[for="age"]+ div button');
const genreButtons = document.querySelectorAll('[for="genre"]+ div button');
const moodButtons = document.querySelectorAll("#mood + div> div");

setupSelectableGroup(ageButtons, "age");
setupSelectableGroup(genreButtons, "genre");
setupSelectableGroup(moodButtons, "mood");

function mapAgeToFilter(age) {
  switch (age) {
    case "UNDER 12":
      return { certification_country: "US", certification_lte: "PG" };

    case "13 - 17":
      return { certification_country: "US", certification_lte: "PG-13" };
    default:
      return {};
  }
}

const GENRE_MAP = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Horror: 27,
  Romance: 10749,
  "Sci-Fi": 878,
};

const MOOD_MAP = {
  Happy: { with_genre: [35, 16] },
  SAD: { with_genre: [18, 10749] },
  Adventurous: { with_genre: [28, 12] },
  Romantic: { with_genre: [10749] },
  Thrilled: { with_genre: [27, 53] },
  Relax: { with_genre: [35, 16] },
};

function buildDiscoverURL(selection, page = 1, sort = "popularity.desc") {
  const params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    sort_by: "sort",
    vote_count_gte: 100,
  });

  const ageFilters = mapAgeToFilter(selection.age);
  Object.entries(ageFilters).forEach(([k, v]) => params.append(k, v));

  if (GENRE_MAP[selection.genre]) {
    params.append("with_genres", GENRE_MAP[selection.genre]);
  }

  if (MOOD_MAP[selection.mood]) {
    MOOD_MAP[selection.mood].with_genre.forEach((g) =>
      params.append("with_genres", g)
    );
  }

  return `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;
}

// Load recommended movies

async function loadRecommendedMovies(selection) {
  try {
    const randomPage = Math.floor(Math.random() * 5) + 1;

    const sortOption = [
      "popularity.desc",
      "vote_average.desc",
      "release_date.desc",
    ];
    const randomSort =
      sortOption[Math.floor(Math.random() * sortOption.length)];

    const res = await fetch(
      buildDiscoverURL(selection, randomPage, randomSort)
    );
    const data = await res.json();

    document.getElementById("sectionTitle").textContent = "Recommended Movies";
    renderMovies(data.results);

    document.getElementById("trending").scrollIntoView({
      behavior: "smooth",
    });
  } catch (error) {
    console.error("Recommendation error", error);
  }
}

function renderMovies(movies) {
  const grid = document.getElementById("popularGrid");
  if (!grid) return;

  grid.innerHTML = "";
  movies.sort(() => Math.random() - 0.5);

  movies.forEach((movie) => {
    const poster = movie.poster_path
      ? IMG_BASE + movie.poster_path
      : "https://via.placeholder.com/500x750?text=No+Image";

    grid.innerHTML += `
      <div class = "bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
      <img src= "${poster}"
     alt= "${movie.title}" class="w-full aspect-2/3 object-cover">
      <div class="p-4">
      <h3 class="font-bold text-sm mb-2 text-gray-800 dark:text-white">
        ${movie.title}
      </h3>
      <p class= "text-xs text-gray-500 dark:text-gray-400 line-clamp-3 mb-2">
      ${movie.overview || "No description available. "}
      </p> 
      <span class= "text-yellow-400 font-semibold text-sm">
      ${movie.vote_average.toFixed(1)}</span>
      </div>
      </div>`;
  });
}
const TOTAL_PAGES = 5;

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
    document.getElementById("sectionTitle").textContent = "Trendig Now";
    renderMovies(allMovies);
  } catch (error) {
    console.error("Failed to load popular movies:", error);
  }
}

const showButton = document.querySelector(".btn-shimmer");

showButton.addEventListener("click", () => {
  const { age, genre, mood } = userSelection;

  if (!age || !genre || !mood) {
    alert("Please select buttons to proceed.");
    return;
  }
  loadRecommendedMovies(userSelection);
});

loadPopularMovies();
