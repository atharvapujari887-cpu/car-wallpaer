document.addEventListener("DOMContentLoaded", () => {
  fetch("./wallpapers.json")  // Load JSON file
    .then(response => response.json())
    .then(data => {
      const gallery = document.getElementById("gallery");

      data.forEach(item => {
        const img = document.createElement("img");
        img.src = item.url;
        img.alt = item.title;
        img.classList.add("wallpaper");

        gallery.appendChild(img);
      });
    })
    .catch(err => console.error("Error loading wallpapers:", err));
});
