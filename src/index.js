import { PixabayAPI } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const searchInputEl = document.querySelector('.form-input');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let simpleLightBoxGallery;

const pixabayAPI = new PixabayAPI();

async function handleFormSubmit(event) {
  event.preventDefault();

  if (searchInputEl.value === '') {
    return;
  }
  pixabayAPI.query = searchInputEl.value.trim();
  searchInputEl.value = '';

  try {
    const { data } = await pixabayAPI.fetchPhotos();
    if (data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.success(`Hooray! We found ${data.totalHits} images`);
    galleryEl.innerHTML = renderGalleryMarkup(data);

    simpleLightBoxGallery = new SimpleLightbox('.gallery a', {
      captions: true,
      captionSelector: 'img',
      captionType: 'attr',
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });

    if (data.totalHits <= pixabayAPI.count || data.totalHits === 0) {
      loadMoreBtn.classList.add('is-hidden');
      return;
    }
    loadMoreBtn.classList.remove('is-hidden');
  } catch (err) {
    console.log(err);
  }
}

async function handleLoadMoreBtnClick() {
  pixabayAPI.page += 1;
  try {
    const { data } = await pixabayAPI.fetchPhotos();
    galleryEl.insertAdjacentHTML('beforeend', renderGalleryMarkup(data));

    const lightBoxInstance = simpleLightBoxGallery.refresh();
    lightBoxInstance.refresh();

    if (data.hits.length <= pixabayAPI.count) {
      loadMoreBtn.classList.add('is-hidden');
      setTimeout(
        () =>
          Notify.warning(
            "We're sorry, but you've reached the end of search results."
          ),
        3000
      );
    }
  } catch (err) {
    console.log(err);
  }
}

loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);
searchFormEl.addEventListener('submit', handleFormSubmit);

function renderGalleryMarkup({ hits }) {
  return hits
    .map(hit => {
      return `
      <div class="photo-card">
         <a class="gallery__item" href="${hit.largeImageURL}">
            <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" height="427" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes </b>${hit.likes}
          </p>
          <p class="info-item">
            <b>Views </b>${hit.views}
          </p>
          <p class="info-item">
            <b>Comments </b>${hit.comments}
          </p>
          <p class="info-item">
            <b>Downloads </b>${hit.downloads}
          </p>
        </div>
      </div>
    `;
    })
    .join('');
}
