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
    gallery.innerHTML = "<p style='color:#ff6f61; font-weight:700;'>No wallpapers found.</p>";
    return;
  }

  wallpapersToShow.forEach((item) => {
    const container = document.createElement("div");
    container.classList.add("wallpaper-item");
    container.setAttribute("tabindex", "0");

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
  const searchInput = document.querySelector(".search-wrapper input");
  const tagButtons = document.querySelectorAll(".tags button");

  // Accessibility attribute helper
  function setAriaPressed(button, isPressed) {
    button.setAttribute("aria-pressed", isPressed);
  }

  function resetTags() {
    tagButtons.forEach((btn) => {
      btn.classList.remove("active");
      setAriaPressed(btn, false);
    });
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
      const isActive = btn.classList.contains("active");
      resetTags();
      if (!isActive) {
        btn.classList.add("active");
        setAriaPressed(btn, true);
        filterWallpapers(tagName);
      } else {
        displayWallpapers(wallpapers);
      }
    });
  });
}

function filterWallpapers(keyword) {
  if (!keyword) {
    displayWallpapers(wallpapers);
    return;
  }
  const filtered = wallpapers.filter(
    (wp) =>
      wp.title.toLowerCase().includes(keyword) ||
      (wp.tags && wp.tags.some((tag) => tag.toLowerCase().includes(keyword)))
  );
  displayWallpapers(filtered);
}


