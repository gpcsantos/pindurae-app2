import axios from 'axios';
import { Buffer } from 'buffer';

const username = import.meta.env.VITE_AUTH_USER;
const password = import.meta.env.VITE_AUTH_PASSWORD;
const auth = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
const baseURL = import.meta.env.VITE_AUTH_API;

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Basic ${auth}`,
  },
});
