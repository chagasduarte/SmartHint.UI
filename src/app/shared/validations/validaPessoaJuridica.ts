import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
import { TipoPessoa } from '../../models/enums/tipoPessoa';

export function validaPessoaJuridica(formGroup: FormGroup): ValidatorFn {
  return (): ValidationErrors | null => {
    const tipoPessoa = formGroup.get('tipoPessoa')?.value;
    const inscricaoEstadual = formGroup.get('inscricaoEstadual')?.value;    
    const nomeRazaoSocial = formGroup.get("nomeRazaoSocial")!; 
    const telefone = formGroup.get("telefone")!; 
    const email = formGroup.get("email")!; 
    const cpfCnpj = formGroup.get("cpfCnpj")!; 
    const senha = formGroup.get("senha")!;
    const confirmaSenha = formGroup.get("confirmaSenha")!;
    const bloqueado = formGroup.get("bloqueado")!;
  
    console.log(tipoPessoa == TipoPessoa.Juridica && inscricaoEstadual && nomeRazaoSocial && telefone && email && cpfCnpj && senha && confirmaSenha && bloqueado)
    return tipoPessoa == TipoPessoa.Juridica && inscricaoEstadual && nomeRazaoSocial && telefone && email && cpfCnpj && senha && confirmaSenha && bloqueado
      ? { pessoaJuridicaValida: true }
      : null;
  };
}