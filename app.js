document.addEventListener("DOMContentLoaded", () => {
  fetch("wallpapers.json")
    .then((res) => res.json())
    .then((wallpapers) => {
      window.wallpapers = wallpapers; // save globally
      initSidebar();
      initSearch();
      renderGallery(wallpapers);
      initModal();
      initLikes();
    })
    .catch((e) => console.error("Error loading wallpapers:", e));
});

function renderGallery(wallpapers) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  if (wallpapers.length === 0) {
    gallery.innerHTML = "<p>No wallpapers found.</p>";
    return;
  }
  wallpapers.forEach((wallpaper) => {
    const div = document.createElement("div");
    div.className = "wallpaper-item";
    div.dataset.id = wallpaper.id;

    const img = document.createElement("img");
    img.src = wallpaper.url;
    img.alt = wallpaper.title;
    img.loading = "lazy";

    const title = document.createElement("div");
    title.className = "wallpaper-title";
    title.textContent = wallpaper.title;

    div.appendChild(img);
    div.appendChild(title);
    gallery.appendChild(div);

    div.addEventListener("click", () => openModal(wallpaper));
  });
}

function initSidebar() {
  const sidebarLinks = document.querySelectorAll(".sidebar ul li a");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      sidebarLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      const filter = link.dataset.filter;
      filterWallpapers(filter);
      clearSearch();
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      renderGallery(window.wallpapers);
      setSidebarActive("all");
      return;
    }
    const filtered = window.wallpapers.filter((wp) =>
      wp.title.toLowerCase().includes(query) ||
      wp.tags.some((tag) => tag.toLowerCase().includes(query))
    );
    renderGallery(filtered);
    clearSidebarActive();
  });

  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") searchButton.click();
  });
}

function filterWallpapers(filter) {
  if (filter === "all") {
    renderGallery(window.wallpapers);
    return;
  }
  const filtered = window.wallpapers.filter((wp) =>
    wp.tags.includes(filter)
  );
  renderGallery(filtered);
}

function clearSearch() {
  document.getElementById("search-input").value = "";
}

function clearSidebarActive() {
  document.querySelectorAll(".sidebar ul li a").forEach((l) => {
    l.classList.remove("active");
  });
}

function setSidebarActive(filter) {
  clearSidebarActive();
  const link = document.querySelector(`.sidebar ul li a[data-filter="${filter}"]`);
  if (link) link.classList.add("active");
}

// Modal related functions
function initModal() {
  const modal = document.getElementById("modal");
  const modalClose = document.getElementById("modal-close");

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

function openModal(wallpaper) {
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  const modalTitle = document.getElementById("modal-title");
  const downloadBtn = document.getElementById("download-btn");
  const likeBtn = document.getElementById("like-btn");

  modalImage.src = wallpaper.url;
  modalImage.alt = wallpaper.title;
  modalTitle.textContent = wallpaper.title;
  downloadBtn.href = wallpaper.url;
  downloadBtn.download = wallpaper.title;

  // Update like button state
  if (isLiked(wallpaper.id)) {
    likeBtn.classList.add("liked");
    likeBtn.textContent = "❤️ Liked";
  } else {
    likeBtn.classList.remove("liked");
    likeBtn.textContent = "❤️ Like";
  }

  // Setup like button click
  likeBtn.onclick = () => toggleLike(wallpaper.id);

  modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.add("hidden");
}

// Like functionality using localStorage
function initLikes() {
  // Nothing needed here now, future expansions possible
}

function toggleLike(id) {
  const liked = JSON.parse(localStorage.getItem("likedWallpapers")) || {};
  const likeBtn = document.getElementById("like-btn");
  if (liked[id]) {
    delete liked[id];
    likeBtn.classList.remove("liked");
    likeBtn.textContent = "❤️ Like";
  } else {
    liked[id] = true;
    likeBtn.classList.add("liked");
    likeBtn.textContent = "❤️ Liked";
  }
  localStorage.setItem("likedWallpapers", JSON.stringify(liked));
}

function isLiked(id) {
  const liked = JSON.parse(localStorage.getItem("likedWallpapers")) || {};
  return !!liked[id];
}
