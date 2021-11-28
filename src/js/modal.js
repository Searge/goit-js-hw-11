import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const initModal = galleryLinks => {
  const modal = new SimpleLightbox(galleryLinks, {
    captionsData: 'alt',
    animationSpeed: 210,
    fadeSpeed: 210,
  });

  return modal;
};

export default initModal;
