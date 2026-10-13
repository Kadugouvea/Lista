type HeaderProps = {
  onNewProduct: () => void
  onDuplicateList: () => void
  onShare: () => void
  onExport: (type: 'json' | 'csv' | 'pdf') => void
}

export function Header({
  onNewProduct,
  onDuplicateList,
  onShare,
  onExport,
}: HeaderProps) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">Lista pessoal</p>
        <h1>Minha Lista de Compras</h1>
      </div>

      <div className="header-actions">
        <button type="button" className="secondary" onClick={onDuplicateList}>
          Duplicar Lista
        </button>
        <button type="button" className="secondary" onClick={onShare}>
          Compartilhar
        </button>

        <div className="export-menu">
          <button type="button" className="secondary" onClick={() => onExport('json')}>
            JSON
          </button>
          <button type="button" className="secondary" onClick={() => onExport('csv')}>
            Excel
          </button>
          <button type="button" className="secondary" onClick={() => onExport('pdf')}>
            PDF
          </button>
        </div>

        <button type="button" className="primary" onClick={onNewProduct}>
          + Novo Produto
        </button>
      </div>
    </header>
  )
}
