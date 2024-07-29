import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule, ValidatorFn, FormBuilder } from '@angular/forms';
import { TipoPessoa } from '../../models/enums/tipoPessoa';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../shared/services/cliente.service';
import { Cliente } from '../../models/cliente';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Sexo } from '../../models/enums/orientacaoSexual';
import { FormValidation } from '../../shared/validations/formValidations';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ 
    ReactiveFormsModule, 
    FormsModule, 
    CommonModule,
    NgxMaskPipe,
    NgxMaskDirective
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent implements OnInit{
  

  mask_cpf_cnpj!: string;
  confirmacaoSenhaValida!: boolean;

  clientFormGroup = new FormGroup({
    //principal
    nomeRazaoSocial: new FormControl("",Validators.required),
    email: new FormControl("",[Validators.email,Validators.required]),
    telefone: new FormControl("",Validators.required),

    //pessoal
    tipoPessoa: new FormControl(TipoPessoa.Fisica, Validators.required),
    cpfCnpj: new FormControl("",[Validators.required]),
    inscricaoEstadual: new FormControl("",Validators.required),
    sexo: new FormControl(Sexo.Feminino),
    dataNascimento: new FormControl(new Date()),

    //senha
    senha: new FormControl("", Validators.required),
  });
  
  validationFormGroup!: FormGroup;

  constructor(
    private readonly router:Router,
    private readonly clienteService: ClienteService,
    private readonly formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.validationFormGroup = this.formBuilder.group({
        confirmaSenha: ["", [Validators.required, FormValidation.equalTo("senha")]]
    })
    this.mask();
  }
  get nomeRazaoSocial(){
    return this.clientFormGroup.get("nomeRazaoSocial")!; 
  }
  get telefone(){
    return this.clientFormGroup.get("telefone")!; 
  }
  get email(){
    return this.clientFormGroup.get("email")!; 
  }
  get tipoPessoa(){
    return this.clientFormGroup.get("tipoPessoa")!; 
  }
  get cpfCnpj(){
    return this.clientFormGroup.get("cpfCnpj")!; 
  }
  get inscricaoEstadual(){
    return this.clientFormGroup.get("inscricaoEstadual")!; 
  }
  get sexo(){
    return  this.clientFormGroup.get("sexo")!;
  }

  get dataNascimento(){
    return this.clientFormGroup.get("dataNascimento")!;
  }
  get senha(){
    return this.clientFormGroup.get("senha")!;
  }

  get confirmaSenha(){
    return this.clientFormGroup.get("confirmaSenha")!;
  }

  cadastrarCliente(){
    if(this.clientFormGroup.valid){
      const cliente : Cliente = {
        id: 0,
        nome: this.nomeRazaoSocial.value || "",
        email: this.email.value || "",
        telefone: this.telefone.value || "",
        tipoPessoa: this.tipoPessoa.value || TipoPessoa.Fisica,
        cpfCnpj: this.cpfCnpj.value || "",
        inscricaoEstadual: this.inscricaoEstadual.value || "",
        dataCadastro: new Date(),
        sexo: this.sexo.value || Sexo.Outros,
        dataNascimento: this.dataNascimento.value || new Date(),
        senha: this.senha.value || ""
      }
      this.clienteService.postCliente(cliente).subscribe({
        next: (success: any) => {
          console.log(success);
        }
      });
      this.clientes();
    }
    
  }

  mask(){
    if (this.clientFormGroup.get("tipoPessoa")?.value == TipoPessoa.Fisica){
      this.mask_cpf_cnpj = "000.000.000-00"
    }
    if (this.clientFormGroup.get("tipoPessoa")?.value == TipoPessoa.Juridica){
      this.mask_cpf_cnpj = "00.000.000/0000-00";
    }
    this.clientFormGroup.controls.cpfCnpj.setValue("");
  }
  clientes(){
    this.router.navigate([""]);
  }
  confirmarSenha(){
    if(this.senha != this.confirmaSenha){
      this.confirmacaoSenhaValida = false;
    }
    else {
      this.confirmacaoSenhaValida = true;
    }
    console.log("aqui")
  }


}
