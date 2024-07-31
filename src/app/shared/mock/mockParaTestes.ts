import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Cliente } from "../../models/cliente";
import { ClientePage } from "../../models/cliente-page";
import { Genero } from "../../models/enums/orientacaoSexual";
import { TipoPessoa } from "../../models/enums/tipoPessoa";



export const MockClientePut: Cliente = {
  id: 2,
  nome: 'Teste',
  email: 'teste@test.com',
  telefone: '123456789',
  tipoPessoa: TipoPessoa.Fisica,
  cpfCnpj: '123.456.789-00',
  inscricaoEstadual: '',
  dataCadastro: '2024-07-30',
  genero: Genero.Outros,
  dataNascimento: '2024-07-30',
  senha: 'senha1234',
  bloqueado: false,
  isento: false
}

export const MockClientePost: Cliente = {
  id: 0,
  nome: 'Teste',
  email: 'teste@test.com',
  telefone: '123456789',
  tipoPessoa: TipoPessoa.Fisica,
  cpfCnpj: '123.456.789-00',
  inscricaoEstadual: '',
  dataCadastro: '2024-07-30',
  genero: Genero.Outros,
  dataNascimento: '2024-07-30',
  senha: 'senha1234',
  bloqueado: false,
  isento: false
}
export const MockClientePages: ClientePage = {
    items: [] = [MockClientePost, MockClientePut],
    currentPage: 0,
    totalPage: 0,
    pageSize: 0,
    totalCount: 0
}


export const MockFormGroup: FormGroup =  new FormGroup({
  nomeRazaoSocial: new FormControl("teste"),
  email: new FormControl("teste@teste.com"),
  telefone: new FormControl("12345678910"),

  //pessoal
  tipoPessoa: new FormControl(TipoPessoa.Fisica),
  cpfCnpj: new FormControl("12345678912"),
  inscricaoEstadual: new FormControl({ value: "000000000000", disabled: false }),
  isento: new FormControl(false),
  genero: new FormControl(Genero.Feminino),
  dataNascimento: new FormControl("2020-03-15"),

  //senha
  senha: new FormControl("123456789"),
  confirmaSenha: new FormControl("123456789"),

  //situação
  bloqueado: new FormControl(false)
})
 