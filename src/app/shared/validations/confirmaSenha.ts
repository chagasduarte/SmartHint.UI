import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export function confirmarSenha(formGroup: FormGroup): ValidatorFn {
  return (): ValidationErrors | null => {
    const senha = formGroup.get('senha')?.value;
    const confirmacaoSenha = formGroup.get('confirmaSenha')?.value;
    return senha && confirmacaoSenha && senha !== confirmacaoSenha
      ? { senhasNaoCorrespondem: true }
      : null;
  };
}