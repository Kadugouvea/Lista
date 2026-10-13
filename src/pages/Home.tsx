import { useMemo, useState } from 'react'
import { Dashboard } from '../components/Dashboard'
import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { ProductForm } from '../components/ProductForm'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  createProductTemplate,
  readCategories,
  readProducts,
} from '../services/storage'
import type { FilterStatus, Product, ProductFormValues } from '../types/Product'

const initialProducts: Product[] = [
  {
    id: '1',
    nome: 'Leite',
    categoria: 'Laticínios',
    quantidade: 2,
    unidade: 'Litro',
    preco: 5.9,
    observacao: 'Integral',
    comprado: false,
    favorito: true,
    imagemUrl:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'Arroz',
    categoria: 'Hortifruti',
    quantidade: 5,
    unidade: 'Kg',
    preco: 22.5,
    observacao: 'Tipo 1',
    comprado: true,
    favorito: true,
    imagemUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    nome: 'Frango',
    categoria: 'Carnes',
    quantidade: 1,
    unidade: 'Kg',
    preco: 18.9,
    observacao: 'Sem tempero',
    comprado: false,
    favorito: false,
    imagemUrl:
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date().toISOString(),
  },
]

export function Home() {
  const [products, setProducts] = useLocalStorage<Product[]>(
    'lista-de-compras-pessoal-products',
    readProducts().length ? readProducts() : initialProducts,
  )
  const [categories, setCategories] = useLocalStorage<string[]>(
    'lista-de-compras-pessoal-categories',
    readCategories(),
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('todos')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<'lista' | 'historico' | 'configuracoes'>('lista')

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === 'todos'
          ? true
          : statusFilter === 'comprados'
            ? product.comprado
            : !product.comprado

      return matchesSearch && matchesStatus
    })
  }, [products, searchTerm, statusFilter])

  const handleSubmit = (values: ProductFormValues) => {
    const normalizedValues = {
      ...values,
      nome: values.nome.trim(),
      categoria: values.categoria.trim() || 'Outros',
      observacao: values.observacao.trim(),
      quantidade: Number(values.quantidade) || 1,
      preco: Number(values.preco) || 0,
      imagemUrl: values.imagemUrl?.trim() || '',
    }

    if (editingProductId) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingProductId
            ? { ...product, ...normalizedValues }
            : product,
        ),
      )
    } else {
      const newProduct: Product = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...normalizedValues,
      }

      setProducts((currentProducts) => [newProduct, ...currentProducts])
    }

    setEditingProductId(null)
    setIsFormOpen(false)
  }

  const handleDelete = (id: string) => {
    const productToRemove = products.find((product) => product.id === id)
    if (!productToRemove) {
      return
    }

    const confirmed = window.confirm(`Deseja realmente excluir "${productToRemove.nome}"?`)
    if (!confirmed) {
      return
    }

    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== id))
  }

  const handleTogglePurchased = (id: string) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id ? { ...product, comprado: !product.comprado } : product,
      ),
    )
  }

  const handleToggleFavorite = (id: string) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id ? { ...product, favorito: !product.favorito } : product,
      ),
    )
  }

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id)
    setIsFormOpen(true)
  }

  const handleAddCategory = (category: string) => {
    setCategories((currentCategories) => {
      const categoriesExists = currentCategories.some(
        (currentCategory) => currentCategory.toLowerCase() === category.toLowerCase(),
      )

      if (categoriesExists) {
        return currentCategories
      }

      return [...currentCategories, category]
    })
  }

  const handleDuplicateList = () => {
    const duplicatedProducts = products.map((product) => ({
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      nome: `${product.nome} (Cópia)`,
      comprado: false,
      favorito: false,
    }))

    setProducts((currentProducts) => [...currentProducts, ...duplicatedProducts])
  }

  const exportFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const handleExport = (type: 'json' | 'csv' | 'pdf') => {
    if (type === 'json') {
      exportFile('lista-de-compras.json', JSON.stringify(products, null, 2), 'application/json')
      return
    }

    if (type === 'csv') {
      const headers = ['Nome', 'Categoria', 'Quantidade', 'Unidade', 'Preço', 'Comprado']
      const rows = products.map((product) => [
        product.nome,
        product.categoria,
        String(product.quantidade),
        product.unidade,
        String(product.preco),
        product.comprado ? 'Sim' : 'Não',
      ])

      const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
      exportFile('lista-de-compras.csv', csvContent, 'text/csv;charset=utf-8;')
      return
    }

    window.print()
  }

  const handleShare = async () => {
    const url = `${window.location.origin}?lista=${encodeURIComponent(JSON.stringify(products))}`

    if (navigator.share) {
      await navigator.share({
        title: 'Minha Lista de Compras',
        text: 'Confira minha lista de compras.',
        url,
      })
      return
    }

    await navigator.clipboard.writeText(url)
    window.alert('Link da lista copiado para a área de transferência.')
  }

  const handleOpenNewProduct = () => {
    setEditingProductId(null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingProductId(null)
  }

  const editingProduct = products.find((product) => product.id === editingProductId) ?? null

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">L</div>
          <div>
            <p className="sidebar-label">Minha lista</p>
            <strong>Pessoal</strong>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <button type="button" className={selectedTab === 'lista' ? 'nav-item active' : 'nav-item'} onClick={() => setSelectedTab('lista')}>
            Lista Atual
          </button>
          <button type="button" className={selectedTab === 'historico' ? 'nav-item active' : 'nav-item'} onClick={() => setSelectedTab('historico')}>
            Histórico
          </button>
          <button type="button" className={selectedTab === 'configuracoes' ? 'nav-item active' : 'nav-item'} onClick={() => setSelectedTab('configuracoes')}>
            Configurações
          </button>
        </nav>

        <div className="sidebar-summary">
          <span>Itens</span>
          <strong>{products.length}</strong>
        </div>
      </aside>

      <main className="content-area">
        <Header
          onNewProduct={handleOpenNewProduct}
          onDuplicateList={handleDuplicateList}
          onShare={handleShare}
          onExport={handleExport}
        />

        <Dashboard products={products} />

        <section className="toolbar-panel">
          <div className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Pesquisar item..."
            />
          </div>

          <div className="filter-group" aria-label="Filtrar itens">
            <button type="button" className={statusFilter === 'todos' ? 'filter-button active' : 'filter-button'} onClick={() => setStatusFilter('todos')}>
              Todos
            </button>
            <button type="button" className={statusFilter === 'comprados' ? 'filter-button active' : 'filter-button'} onClick={() => setStatusFilter('comprados')}>
              Comprados
            </button>
            <button type="button" className={statusFilter === 'pendentes' ? 'filter-button active' : 'filter-button'} onClick={() => setStatusFilter('pendentes')}>
              Não comprados
            </button>
          </div>
        </section>

        {isFormOpen && (
          <section className="modal-panel">
            <ProductForm
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={handleCloseForm}
              onAddCategory={handleAddCategory}
              initialValues={
                editingProduct
                  ? {
                      nome: editingProduct.nome,
                      categoria: editingProduct.categoria,
                      quantidade: editingProduct.quantidade,
                      unidade: editingProduct.unidade,
                      preco: editingProduct.preco,
                      observacao: editingProduct.observacao,
                      comprado: editingProduct.comprado,
                      favorito: editingProduct.favorito,
                      imagemUrl: editingProduct.imagemUrl || '',
                    }
                  : createProductTemplate()
              }
            />
          </section>
        )}

        <section className="products-panel">
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onTogglePurchased={handleTogglePurchased}
                onToggleFavorite={handleToggleFavorite}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="empty-state">
              <h3>Nenhum item encontrado</h3>
              <p>Atualize a busca ou adicione um novo produto à sua lista.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
