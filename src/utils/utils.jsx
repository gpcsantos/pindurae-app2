import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
  return num.toLocaleString('pt-BR', {
    style: 'decimal',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}
