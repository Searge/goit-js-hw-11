const getRefs = () => ({
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('[data-gallery]'),
  searchBtn: document.querySelector('[data-search-btn]'),
  loadMoreBtn: document.querySelector('[data-load-more]'),
  header: document.querySelector('.header'),
  main: document.querySelector('main'),
  modal: null,
});

export default getRefs;
