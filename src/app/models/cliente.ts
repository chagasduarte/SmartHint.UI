import { Genero } from "./enums/orientacaoSexual"
import { TipoPessoa } from "./enums/tipoPessoa"

export interface Cliente {
    id: number
    nome: string
    email: string
    telefone: string
    tipoPessoa: number
    cpfCnpj: string
    inscricaoEstadual: string,
    isento: boolean,
    dataCadastro: string,
    senha: string,
    genero: number,
    dataNascimento: string,
    bloqueado: boolean
}