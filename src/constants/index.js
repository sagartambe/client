export const API = 'http://localhost:8080';

export const OKTA_CONFIG = {
  DOMAIN: 'example.com',
  CLIENT_ID: 'myclientid'
};

export const fetcher = (url) => fetch(url).then((res) => res.json());
export const poster = (url, payload) => fetch(url, payload).then((res) => res.json());
