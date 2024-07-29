import { FormControl, FormGroup } from "@angular/forms";

export class FormValidation {
    static equalTo(campo: string){
        const validator = (formControl: FormControl) => {
          if(campo == null){
            throw new Error("É necessário informar a senha.");
          }
    
          const field = (<FormGroup>formControl.root).get(campo);
    
          if(!field){
            throw new Error("É necessário informar campo válido");
          }
          
          if(field.value !== formControl.value){
            return { equalTo: campo}
          }
    
          return null;
        }
        return validator;
      }
    
}