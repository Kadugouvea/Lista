import { useEffect, useState } from 'react'
import type { ProductFormValues } from '../types/Product'

type ProductFormProps = {
  categories: string[]
  onSubmit: (values: ProductFormValues) => void
  onCancel: () => void
  onAddCategory: (category: string) => void
  initialValues?: Partial<ProductFormValues>
}

const emptyValues: ProductFormValues = {
  nome: '',
  categoria: 'Hortifruti',
  quantidade: 1,
  unidade: 'Unidade',
  preco: 0,
  observacao: '',
  comprado: false,
  favorito: false,
  imagemUrl: '',
}

export function ProductForm({
  categories,
  onSubmit,
  onCancel,
  onAddCategory,
  initialValues,
}: ProductFormProps) {
  const [formValues, setFormValues] = useState<ProductFormValues>({
    ...emptyValues,
    ...(initialValues ?? {}),
  })
  const [newCategory, setNewCategory] = useState('')
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)

  useEffect(() => {
    setFormValues({ ...emptyValues, ...(initialValues ?? {}) })
  }, [initialValues])

  const handleFieldChange = (
    field: keyof ProductFormValues,
    value: string | number | boolean,
  ) => {
    setFormValues((current) => ({ ...current, [field]: value }))
  }

  const handleAddCategory = () => {
    const sanitizedCategory = newCategory.trim()
    if (!sanitizedCategory) {
      return
    }

    const formattedCategory =
      sanitizedCategory.charAt(0).toUpperCase() + sanitizedCategory.slice(1)

    if (!categories.some((category) => category.toLowerCase() === formattedCategory.toLowerCase())) {
      onAddCategory(formattedCategory)
      setFormValues((current) => ({ ...current, categoria: formattedCategory }))
    } else {
      setFormValues((current) => ({ ...current, categoria: formattedCategory }))
    }

    setNewCategory('')
    setIsCreatingCategory(false)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit({
      ...formValues,
      nome: formValues.nome.trim(),
      categoria: formValues.categoria.trim() || 'Outros',
      observacao: formValues.observacao.trim(),
      quantidade: Number(formValues.quantidade) || 1,
      preco: Number(formValues.preco) || 0,
    })
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{initialValues ? 'Editar produto' : 'Novo produto'}</h2>
        <button className="icon-button" type="button" onClick={onCancel}>
          ×
        </button>
      </div>

      <div className="field-grid">
        <label>
          Nome
          <input
            type="text"
            value={formValues.nome}
            onChange={(event) => handleFieldChange('nome', event.target.value)}
            placeholder="Ex: Leite integral"
            required
          />
        </label>

        <label>
          Quantidade
          <input
            type="number"
            min="1"
            value={formValues.quantidade}
            onChange={(event) => handleFieldChange('quantidade', Number(event.target.value))}
          />
        </label>

        <label>
          URL da imagem
          <input
            type="url"
            value={formValues.imagemUrl}
            onChange={(event) => handleFieldChange('imagemUrl', event.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </label>

        <label>
          Categoria
          <div className="inline-category">
            <input
              list="category-options"
              value={formValues.categoria}
              onChange={(event) => handleFieldChange('categoria', event.target.value)}
            />
            <button type="button" className="secondary tiny" onClick={() => setIsCreatingCategory((current) => !current)}>
              + Nova
            </button>
          </div>
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>

          {isCreatingCategory && (
            <div className="category-creator">
              <input
                type="text"
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="Nome da nova categoria"
              />
              <button type="button" className="primary tiny" onClick={handleAddCategory}>
                Salvar
              </button>
            </div>
          )}
        </label>

        <label>
          Unidade
          <select
            value={formValues.unidade}
            onChange={(event) => handleFieldChange('unidade', event.target.value)}
          >
            <option value="Unidade">Unidade</option>
            <option value="Kg">Kg</option>
            <option value="Gramas">Gramas</option>
            <option value="Litro">Litro</option>
            <option value="Mililitro">Mililitro</option>
            <option value="Caixa">Caixa</option>
            <option value="Pacote">Pacote</option>
            <option value="Pote">Pote</option>
            <option value="Par">Par</option>
          </select>
        </label>

        <label>
          Preço estimado
          <input
            type="number"
            min="0"
            step="0.01"
            value={formValues.preco}
            onChange={(event) => handleFieldChange('preco', Number(event.target.value))}
          />
        </label>

        {formValues.imagemUrl && (
          <div className="image-preview-wrapper full-width">
            <span className="label">Pré-visualização</span>
            <img
              className="image-preview"
              src={formValues.imagemUrl}
              alt="Pré-visualização do produto"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

        <label className="full-width">
          Observações
          <textarea
            value={formValues.observacao}
            onChange={(event) => handleFieldChange('observacao', event.target.value)}
            rows={3}
            placeholder="Ex: integral, sem açúcar, preferir orgânico..."
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="primary">
          {initialValues ? 'Salvar alterações' : 'Adicionar produto'}
        </button>
      </div>
    </form>
  )
}
