import type { Product } from '../types/Product'

export const defaultCategories = [
  'Hortifruti',
  'Carnes',
  'Laticínios',
  'Padaria',
  'Bebidas',
  'Limpeza',
  'Higiene',
  'Congelados',
  'Pet Shop',
  'Outros',
]

export const createProductTemplate = (): Omit<Product, 'id' | 'createdAt'> => ({
  nome: '',
  categoria: defaultCategories[0],
  quantidade: 1,
  unidade: 'Unidade',
  preco: 0,
  observacao: '',
  comprado: false,
  favorito: false,
  imagemUrl: '',
})

export const readProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem('lista-de-compras-pessoal-products')
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const writeProducts = (products: Product[]) => {
  localStorage.setItem('lista-de-compras-pessoal-products', JSON.stringify(products))
}

export const readCategories = (): string[] => {
  try {
    const stored = localStorage.getItem('lista-de-compras-pessoal-categories')
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) && parsed.length ? parsed : defaultCategories
  } catch {
    return defaultCategories
  }
}

export const writeCategories = (categories: string[]) => {
  localStorage.setItem('lista-de-compras-pessoal-categories', JSON.stringify(categories))
}
