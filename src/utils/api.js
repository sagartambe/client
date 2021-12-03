import { getItem } from './localStorage'

const API = 'http://localhost:8080';

const fetcher = (url) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getItem('access_token')
    }
  };
  return fetch(`${API}/${url}`, requestOptions).then((res) => res.json());
};

const poster = (url, payload) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getItem('access_token')
    },
    body: JSON.stringify(payload),
  };
  return fetch(`${API}/${url}`, requestOptions).then((res) => res.json());
};

export { fetcher, poster };