import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
import { TipoPessoa } from '../../models/enums/tipoPessoa';

export function confirmaInscricaoEstadual(formGroup: FormGroup): ValidatorFn {
  return (): ValidationErrors | null => {
    const tipoPessoa = formGroup.get('tipoPessoa')?.value;
    const inscricaoEstadual = formGroup.get('inscricaoEstadual')?.value;
    const isento = formGroup.get("isento")?.value;

    return (tipoPessoa == TipoPessoa.Juridica && !inscricaoEstadual) || (tipoPessoa == TipoPessoa.Fisica && !isento && !inscricaoEstadual)
      ? { inscricaoEstadualObrigatoria: true }
      : null;
  };
}