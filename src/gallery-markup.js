export function renderGalleryMarkup({ hits }) {
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
