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
  gallery.innerHTML = ""; // Clear previous wallpapers

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
  const tagSpans = document.querySelectorAll(".tags span");

  // Reset active on tags function
  function resetTags() {
    tagSpans.forEach((tag) => tag.classList.remove("active"));
  }

  searchBtn.addEventListener("click", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    resetTags();
    filterWallpapers(keyword);
  });

  tagSpans.forEach((tag) => {
    tag.addEventListener("click", () => {
      const tagName = tag.dataset.tag.toLowerCase();
      searchInput.value = "";
      if (tag.classList.contains("active")) {
        tag.classList.remove("active");
        displayWallpapers(wallpapers);
      } else {
        resetTags();
        tag.classList.add("active");
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
