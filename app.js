fetch("wallpapers.json")
  .then(response => response.json())
  .then(data => {
    const gallery = document.getElementById("gallery");
    data.forEach(wallpaper => {
      const img = document.createElement("img");
      img.src = wallpaper.thumb;
      img.alt = wallpaper.title;
      img.onclick = () => window.open(wallpaper.src, "_blank");
      gallery.appendChild(img);
    });
  });
