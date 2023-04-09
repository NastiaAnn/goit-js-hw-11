export class PixabayAPI {
  #API_KEY = '35232464-dd394eb40b88e49b2f7bb554e';
  #BASE_URL = 'https://pixabay.com';

  query = null;
  page = 1;
  count = 40;

  baseSearchParams = {
    per_page: this.count,
    key: this.#API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  };

  fetchPhotos() {
    const searchParams = new URLSearchParams({
      q: this.query,
      page: this.page,
      ...this.baseSearchParams,
    });
    return fetch(`${this.#BASE_URL}/api/?${searchParams}`).then(res => {
      if (!res.ok) {
        throw new Error(response.status);
      }

      return res.json();
    });
  }
}
