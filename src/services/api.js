import axios from 'axios';
import { Buffer } from 'buffer';

const username = import.meta.env.VITE_AUTH_USER;
const password = import.meta.env.VITE_AUTH_PASSWORD;
const auth = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    Authorization: `Basic ${auth}`,
  },
});
