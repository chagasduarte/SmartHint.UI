import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export function confirmarSenha(formGroup: FormGroup): ValidatorFn {
  return (): ValidationErrors | null => {
    const senha = formGroup.get('senha')?.value;
    const confirmacaoSenha = formGroup.get('confirmaSenha')?.value;
    console.log(senha,confirmacaoSenha , senha !== confirmacaoSenha)
    return senha && confirmacaoSenha && senha !== confirmacaoSenha
      ? { senhasNaoCorrespondem: true }
      : null;
  };
}