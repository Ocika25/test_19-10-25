/* script.js*/ 

document.addEventListener('DOMContentLoaded', () => {
  const galleryImages = Array.from(document.querySelectorAll('.gallery img'));
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || galleryImages.length === 0) return;

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = lightbox.querySelector('.prev');
  const nextBtn = lightbox.querySelector('.next');

  let currentIndex = -1;

  function openLightbox(index) {
    currentIndex = index;
    // wenn du für hochauflösende Versionen ein data-full verwendest, nutze das
    const src = galleryImages[index].dataset.full || galleryImages[index].src;
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // scroll verhindern
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  galleryImages.forEach((img, idx) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(idx));
  });

  closeBtn.addEventListener('click', closeLightbox);

  // Klick außerhalb des Bildes schließt die Lightbox
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox((currentIndex + 1) % galleryImages.length);
  });

  // Tastatur: ESC, Links, Rechts
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
});
