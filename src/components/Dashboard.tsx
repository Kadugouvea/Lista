import { formatCurrency, getDashboardStats } from '../utils/calculations'
import type { Product } from '../types/Product'

type DashboardProps = {
  products: Product[]
}

export function Dashboard({ products }: DashboardProps) {
  const stats = getDashboardStats(products)

  return (
    <section className="dashboard-grid" aria-label="Resumo da lista de compras">
      <div className="stat-card accent">
        <span>Total de produtos</span>
        <strong>{stats.totalProdutos}</strong>
      </div>
      <div className="stat-card success">
        <span>Produtos comprados</span>
        <strong>{stats.comprados}</strong>
      </div>
      <div className="stat-card warning">
        <span>Produtos pendentes</span>
        <strong>{stats.pendentes}</strong>
      </div>
      <div className="stat-card neutral">
        <span>Valor total previsto</span>
        <strong>{formatCurrency(stats.valorTotal)}</strong>
      </div>
    </section>
  )
}
