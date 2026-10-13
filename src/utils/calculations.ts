import type { Product } from '../types/Product'

export const getDashboardStats = (products: Product[]) => {
  const totalProdutos = products.length
  const comprados = products.filter((product) => product.comprado).length
  const pendentes = totalProdutos - comprados
  const valorTotal = products.reduce((total, product) => {
    const preco = Number(product.preco) || 0
    const quantidade = Number(product.quantidade) || 0
    return total + preco * quantidade
  }, 0)

  return {
    totalProdutos,
    comprados,
    pendentes,
    valorTotal,
  }
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
