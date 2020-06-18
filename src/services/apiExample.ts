import axios from 'axios';

const api = axios.create({
  baseURL: 'https://FIREBASE_PROJECT_NAME.firebaseio.com/',
});

const unsplashApi = axios.create({
  baseURL: 'https://api.unsplash.com/',
});

const geodbApi = axios.create({
  baseURL: 'http://geodb-free-service.wirefreethought.com/',
});

export { unsplashApi, geodbApi };

export default api;
