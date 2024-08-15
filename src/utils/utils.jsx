import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const optionsNumber = {
  style: 'decimal',
  currency: 'BRL',
  minimumFractionDigits: 2,
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function par(num) {
  return num % 2;
}

export function orderAlfabetc(data) {
  return data.sort((a, b) => {
    if (a.descricao.toLowerCase() < b.descricao.toLowerCase()) return -1;
    if (a.descricao.toLowerCase() > b.descricao.toLowerCase()) return 1;
    return 0;
  });
}

export function formatCurrency(num) {
  return num.toLocaleString('pt-BR', optionsNumber);
}

export function formatDate(date) {
  let dt = new Date(date);
  var d = dt.toLocaleDateString('pt-BR');
  var t = dt.toLocaleTimeString('pt-BR');
  t = t.replace(/\u200E/g, '');
  t = t.replace(/^([^\d]*\d{1,2}:\d{1,2}):\d{1,2}([^\d]*)$/, '$1$2');
  var result = d + ' ' + t;
  return result;
}
