import getRefs from './refs';
const refs = getRefs();

const smoothScrollAfterRender = currentPage => {
  if (currentPage === 1) {
    return window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

export default smoothScrollAfterRender;
