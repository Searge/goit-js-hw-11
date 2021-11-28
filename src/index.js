import './sass/main.scss';
import axios from 'axios';
import { Notify } from 'notiflix';
import { Loading } from 'notiflix';

import debounce from 'lodash/debounce';
import imagesAPI from './js/api-service';
import UI from './js/ui-service';
import getRefs from './js/refs';
import initModal from './js/modal';
import smoothScrollAfterRender from './js/scroll';

const refs = getRefs();
refs.modal = initModal('.gallery a');

const DEBOUNCE_DELAY = 300;
const DEBOUNCE_SETTINGS = { leading: true, trailing: false };
const notifyOptions = {
  timeout: 4000,
};

refs.main.style.marginTop = `${refs.header.clientHeight}px`;

const imageAPI = new imagesAPI();

const notifyStatus = imagesCount => {
  if (imagesCount < 1) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      notifyOptions,
    );
    return 1;
  }

  if (imageAPI.totalHits > 0 && imageAPI.page === 1) {
    Notify.success(
      `Hooray! We found ${imageAPI.totalHits} images.`,
      notifyOptions,
    );
    return 0;
  }
};

const fetchAndRenderImages = async () => {
  try {
    const { hits, totalHits } = await imageAPI.getImages();

    imageAPI.totalHits = totalHits;
    imageAPI.totalPages = Math.ceil(imageAPI.totalHits / imageAPI.perPage);
    imageAPI.currentlyLoaded = imageAPI.perPage * imageAPI.page;

    if (notifyStatus(hits.length)) return;

    await UI.renderGallery(hits);
    smoothScrollAfterRender(imageAPI.page);

    refs.modal.refresh();

    console.log('fetchAndRenderImages ~ refs.modal', refs.modal);

    if (imageAPI.totalHits > imageAPI.currentlyLoaded) {
      const waitImgComplete = [...document.images]
        .filter(img => !img.complete)
        .map(img => new Promise(res => (img.onload = img.onerror = res)));

      await Promise.all(waitImgComplete);
      UI.show(refs.loadMoreBtn);
    }

    if (imageAPI.totalHits <= imageAPI.currentlyLoaded) {
      return showPopupEndOfResults();
    }

    imageAPI.page += 1;
  } catch (error) {
    console.error(error);
  }
};

const showPopupEndOfResults = () => {
  Notify.info(
    "We're sorry, but you've reached the end of search results.",
    notifyOptions,
  );
};

const onSubmitGetImages = async e => {
  e.preventDefault();
  UI.disable(refs.searchBtn);

  setTimeout(() => UI.enable(refs.searchBtn), 800);

  UI.hide(refs.loadMoreBtn);
  UI.clearUI();

  imageAPI.query = e.target.elements.searchQuery.value.trim();
  imageAPI.page = 1;

  if (imageAPI.query === '')
    return Notify.info('Please fill in the search field');

  await fetchAndRenderImages();
};

const onLoadMore = async e => {
  UI.hide(refs.loadMoreBtn);

  await fetchAndRenderImages();
};

const onImageClick = async e => {
  e.preventDefault();
};

refs.searchForm.addEventListener(
  'submit',
  debounce(onSubmitGetImages, DEBOUNCE_DELAY, DEBOUNCE_SETTINGS),
);
refs.loadMoreBtn.addEventListener(
  'click',
  debounce(onLoadMore, DEBOUNCE_DELAY, DEBOUNCE_SETTINGS),
);
refs.gallery.addEventListener('click', onImageClick);
