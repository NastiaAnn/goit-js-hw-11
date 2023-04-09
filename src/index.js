import { PixabayAPI } from './pixabay-api';
import axios from 'axios';

const searchFormEl = document.querySelector('.search-form');
const searchInputEl = document.querySelector('.form-input');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();

function handleFormSubmit(event) {
  event.preventDefault();

  if (searchInputEl.value === '') {
    return;
  }
  pixabayAPI.query = searchInputEl.value.trim();
  searchInputEl.value = '';

  pixabayAPI
    .fetchPhotos()
    .then(data => {
      console.log(data);
      galleryEl.innerHTML = renderGalleryMarkup(data);

      if (data.totalHits <= pixabayAPI.count || data.totalHits === 0) {
        loadMoreBtn.classList.add('is-hidden');
        return;
      }
      loadMoreBtn.classList.remove('is-hidden');
    })
    .catch(err => console.log(err));
}

function handleLoadMoreBtnClick() {
  pixabayAPI.page += 1;
  pixabayAPI
    .fetchPhotos()
    .then(data => {
      galleryEl.insertAdjacentHTML('beforeend', renderGalleryMarkup(data));
      if (data.hits.length <= pixabayAPI.count) {
        loadMoreBtn.classList.add('is-hidden');
      }
    })
    .catch(err => console.log(err));
}

loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);
searchFormEl.addEventListener('submit', handleFormSubmit);

function renderGalleryMarkup({ hits }) {
  return hits
    .map(hit => {
      return `
      <div class="photo-card">
        <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" height="427" />
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
