import { TipoPessoa } from "./enums/tipoPessoa"

export interface Cliente {
    id: number
    nome: string
    email: string
    telefone: string
    tipoPessoa: TipoPessoa
    cpfCnpj: string
    inscricaoEstadual: string
    dataCadastro: Date
}