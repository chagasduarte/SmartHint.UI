import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule, ValidatorFn, FormBuilder } from '@angular/forms';
import { TipoPessoa } from '../../models/enums/tipoPessoa';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../shared/services/cliente.service';
import { Cliente } from '../../models/cliente';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Genero } from '../../models/enums/orientacaoSexual';
import { confirmarSenha } from '../../shared/validations/confirmaSenha';
import { confirmaInscricaoEstadual } from '../../shared/validations/inscricaoEstadual';

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

  clientFormGroup: FormGroup;
  senhaIsConfirmed!: boolean;
  isento: boolean = false;
  inscEstadualPlaceHolder: string = "000.000.000-000"

  constructor(
    private readonly router:Router,
    private readonly clienteService: ClienteService,
    private readonly formBuilder: FormBuilder
  ){
    this.clientFormGroup = formBuilder.group({
      nomeRazaoSocial: ["",[Validators.required, Validators.maxLength(150)]],
      email: ["",[Validators.email,Validators.required, Validators.maxLength(150)]],
      telefone: ["",[Validators.required, Validators.maxLength(11)]],

      //pessoal
      tipoPessoa: [TipoPessoa.Fisica, Validators.required],
      cpfCnpj: ["",[Validators.required, Validators.maxLength(14)]],
      inscricaoEstadual: [{ value: '', disabled: this.isento }, [Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{3}$/)]],
      isento: [false],
      genero: [Genero.Feminino],
      dataNascimento: [new Date()],

      //senha
      senha: ["", [Validators.required,]],
      confirmaSenha: [""],

      //situação
      bloqueado: [false, [Validators.required]]
    });

    this.clientFormGroup.controls["confirmaSenha"].addValidators(confirmarSenha(this.clientFormGroup));
    this.clientFormGroup.controls["inscricaoEstadual"].addValidators(confirmaInscricaoEstadual(this.clientFormGroup))

    // Atualiza o estado do campo quando o checkbox é alterado
    this.clientFormGroup.get('isento')?.valueChanges.subscribe(value => {
      this.isento = value;
      if (this.isento) {
        this.clientFormGroup.get('inscricaoEstadual')?.disable();
      } else {
        this.clientFormGroup.get('inscricaoEstadual')?.enable();
      }
    });
  }

  ngOnInit(): void {
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
  get genero(){
    return  this.clientFormGroup.get("genero")!;
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
  get inscricaoEstadualPessoaFisica(){
    return this.clientFormGroup.get("inscricaoEstadualPessoaFisica")!;
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
        genero: this.genero.value || Genero.Outros,
        dataNascimento: this.dataNascimento.value || new Date(),
        senha: this.senha.value || "",
        inscricaoEstadualPessoaFisica: false,
        bloqueado: false
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
    this.clientFormGroup.controls['cpfCnpj'].setValue("");
  }
  clientes(){
    this.router.navigate([""]);
  }

  isentar(event:Event){
    const isento = event?.target as HTMLInputElement;
    if(isento.checked){
      this.inscEstadualPlaceHolder = "Isento"
    }
    else{
      this.inscEstadualPlaceHolder = "000.000.000-000"
    }
  }

}
