import { ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
import { TipoPessoa } from '../../models/enums/tipoPessoa';

export function validaDataNascimento(formGroup: FormGroup): ValidatorFn {
  return (): ValidationErrors | null => {
    const tipoPessoa = formGroup.get('tipoPessoa')?.value;
    const dataNascimento = formGroup.get('dataNascimento')?.value;

    return (tipoPessoa == TipoPessoa.Fisica && !dataNascimento)
      ? { dataNascimentoObrigatoria: true }
      : null;
  };
}