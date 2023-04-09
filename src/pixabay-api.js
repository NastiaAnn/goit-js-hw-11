import axios from 'axios';

export class PixabayAPI {
  #API_KEY = '35232464-dd394eb40b88e49b2f7bb554e';
  #BASE_URL = 'https://pixabay.com';

  query = null;
  page = 1;
  count = 40;

  async fetchPhotos() {
    try {
      return axios.get(`${this.#BASE_URL}/api/`, {
        params: {
          q: this.query,
          page: this.page,
          per_page: this.count,
          key: this.#API_KEY,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
        },
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
