import photosTemplate from '../templates/gallery-items.hbs';
import getRefs from './refs';
const refs = getRefs();

const show = (...els) => els.forEach(e => e?.classList.remove('is-hidden'));
const hide = (...els) => els.forEach(e => e?.classList.add('is-hidden'));
const enable = (...els) => els.forEach(e => e?.removeAttribute('disabled'));
const disable = (...els) => els.forEach(e => e?.setAttribute('disabled', true));

const clearUI = () => (refs.gallery.innerHTML = '');
const renderUI = (el, markup) => el?.insertAdjacentHTML('beforeend', markup);
const renderGallery = items => renderUI(refs?.gallery, photosTemplate(items));

export default { renderGallery, clearUI, enable, disable, show, hide };
