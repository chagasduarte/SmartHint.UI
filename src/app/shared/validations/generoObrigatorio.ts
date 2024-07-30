import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
import { TipoPessoa } from '../../models/enums/tipoPessoa';

export function generoObrigatorio(formGroup: FormGroup): ValidatorFn {
  return (): ValidationErrors | null => {
    const genero = formGroup.get('genero')?.value;
    const tipoPessoa = formGroup.get('tipoPessoa')?.value;
    return tipoPessoa == TipoPessoa.Fisica && !genero
      ? { generoObrigatorio: true }
      : null;
  };
}