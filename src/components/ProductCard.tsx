import type { Product } from '../types/Product'
import { formatCurrency } from '../utils/calculations'

type ProductCardProps = {
  product: Product
  onTogglePurchased: (id: string) => void
  onToggleFavorite: (id: string) => void
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export function ProductCard({
  product,
  onTogglePurchased,
  onToggleFavorite,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const imageSource =
    product.imagemUrl ||
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'

  return (
    <article className={`product-card ${product.comprado ? 'is-comprado' : ''}`}>
      <div className="product-header">
        <button
          type="button"
          className={`favorite-button ${product.favorito ? 'active' : ''}`}
          onClick={() => onToggleFavorite(product.id)}
          aria-label={product.favorito ? 'Remover favorito' : 'Adicionar favorito'}
        >
          {product.favorito ? '★' : '☆'}
        </button>

        <div className="product-visual">
          <img
            className="product-image"
            src={imageSource}
            alt={product.nome}
            onError={(event) => {
              event.currentTarget.src =
                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'
            }}
          />
        </div>

        <div className="product-title-wrap">
          <h3>{product.nome}</h3>
          <span className="category-pill">{product.categoria}</span>
        </div>

        <label className="status-toggle">
          <input
            type="checkbox"
            checked={product.comprado}
            onChange={() => onTogglePurchased(product.id)}
          />
          <span>{product.comprado ? 'Comprado' : 'Pendente'}</span>
        </label>
      </div>

      <div className="product-details">
        <div>
          <span className="label">Quantidade</span>
          <strong>
            {product.quantidade} {product.unidade}
          </strong>
        </div>
        <div>
          <span className="label">Preço</span>
          <strong>{formatCurrency(product.preco * product.quantidade)}</strong>
        </div>
      </div>

      {product.observacao && <p className="product-observacao">{product.observacao}</p>}

      <div className="product-actions">
        <button type="button" className="secondary" onClick={() => onEdit(product)}>
          Editar
        </button>
        <button type="button" className="danger" onClick={() => onDelete(product.id)}>
          Excluir
        </button>
      </div>
    </article>
  )
}
