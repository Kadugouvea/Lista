export type Product = {
  id: string
  nome: string
  categoria: string
  quantidade: number
  unidade: string
  preco: number
  observacao: string
  comprado: boolean
  favorito: boolean
  imagemUrl?: string
  createdAt: string
}

export type FilterStatus = 'todos' | 'comprados' | 'pendentes'

export type ProductFormValues = {
  nome: string
  categoria: string
  quantidade: number
  unidade: string
  preco: number
  observacao: string
  comprado: boolean
  favorito: boolean
  imagemUrl: string
}
