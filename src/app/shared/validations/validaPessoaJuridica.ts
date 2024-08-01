import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
import { TipoPessoa } from '../../models/enums/tipoPessoa';

export function validaPessoaJuridica(formGroup: FormGroup): ValidatorFn {
  return (): ValidationErrors | null => {
    const tipoPessoa = formGroup.get('tipoPessoa')?.value;
    const inscricaoEstadual = formGroup.get('inscricaoEstadual')!;    
    const nomeRazaoSocial = formGroup.get("nomeRazaoSocial")!; 
    const telefone = formGroup.get("telefone")!; 
    const email = formGroup.get("email")!; 
    const cpfCnpj = formGroup.get("cpfCnpj")!; 
    const senha = formGroup.get("senha")!;
    const confirmaSenha = formGroup.get("confirmaSenha")!;
    const bloqueado = formGroup.get("bloqueado")!;

    return tipoPessoa == TipoPessoa.Juridica && inscricaoEstadual.valid && nomeRazaoSocial.valid && telefone.valid && email.valid && cpfCnpj.valid && senha.valid && confirmaSenha.valid && bloqueado.valid
      ? { pessoaJuridicaValida: true }
      : null;
  };
}