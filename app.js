let wallpapers = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("./wallpapers.json")
    .then((response) => response.json())
    .then((data) => {
      wallpapers = data;
      displayWallpapers(wallpapers);
      setupSearchAndTags();
    })
    .catch((err) => console.error("Error loading wallpapers:", err));
});

function displayWallpapers(wallpapersToShow) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  if (wallpapersToShow.length === 0) {
    gallery.innerHTML = "<p>No wallpapers found.</p>";
    return;
  }

  wallpapersToShow.forEach((item) => {
    const container = document.createElement("div");
    container.classList.add("wallpaper-item");

    const img = document.createElement("img");
    img.src = item.url;
    img.alt = item.title;
    img.classList.add("wallpaper");
    img.loading = "lazy";

    const caption = document.createElement("div");
    caption.classList.add("caption");
    caption.textContent = item.title;

    container.appendChild(img);
    container.appendChild(caption);
    gallery.appendChild(container);
  });
}

function setupSearchAndTags() {
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.querySelector(".search-box input");
  const tagButtons = document.querySelectorAll(".tags button");

  function resetTags() {
    tagButtons.forEach((btn) => btn.classList.remove("active"));
  }

  searchBtn.addEventListener("click", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    resetTags();
    filterWallpapers(keyword);
  });

  tagButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tagName = btn.dataset.tag.toLowerCase();
      searchInput.value = "";
      if (btn.classList.contains("active")) {
        btn.classList.remove("active");
        displayWallpapers(wallpapers);
      } else {
        resetTags();
        btn.classList.add("active");
        filterWallpapers(tagName);
      }
    });
  });
}

function filterWallpapers(keyword) {
  const filtered = wallpapers.filter(
    (wp) =>
      wp.title.toLowerCase().includes(keyword) ||
      (wp.tags && wp.tags.some((tag) => tag.toLowerCase().includes(keyword)))
  );
  displayWallpapers(filtered);
}
