import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule, ValidatorFn, FormBuilder } from '@angular/forms';
import { TipoPessoa } from '../../models/enums/tipoPessoa';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { ClienteService } from '../../shared/services/cliente.service';
import { Cliente } from '../../models/cliente';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Genero } from '../../models/enums/orientacaoSexual';
import { confirmarSenha } from '../../shared/validations/confirmaSenha';
import { confirmaInscricaoEstadual } from '../../shared/validations/inscricaoEstadual';
import { ToastrService } from 'ngx-toastr';
import { validaDataNascimento } from '../../shared/validations/validaDataNascimento';
import { generoObrigatorio } from '../../shared/validations/generoObrigatorio';
import { validaPessoaJuridica } from '../../shared/validations/validaPessoaJuridica';

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
  modoEdit!: boolean;
  cliente!: Cliente
  
  senhaIsConfirmed!: boolean;
  isIsento: boolean = false;
  inscEstadualPlaceHolder: string = "000.000.000-000"


  clientFormGroup = new FormGroup({
    nomeRazaoSocial: new FormControl("",[Validators.required, Validators.maxLength(150)]),
    email: new FormControl("",[Validators.email,Validators.required, Validators.maxLength(150)]),
    telefone: new FormControl("",[Validators.required, Validators.maxLength(11)]),

    //pessoal
    tipoPessoa: new FormControl(TipoPessoa.Fisica, [Validators.required]),
    cpfCnpj: new FormControl("",[Validators.required, Validators.maxLength(14)]),
    inscricaoEstadual: new FormControl(""),
    isento: new FormControl(false, [Validators.required]),
    genero: new FormControl(Genero.Feminino),
    dataNascimento: new FormControl(""),

    //senha
    senha: new FormControl("", [Validators.required,Validators.minLength(8), Validators.maxLength(15)]),
    confirmaSenha: new FormControl("", [Validators.minLength(8), Validators.maxLength(15)]),

    //situação
    bloqueado: new FormControl(false, [Validators.required])
  })
   

  constructor(
    private readonly router:Router,
    private readonly clienteService: ClienteService,
    private readonly formBuilder: FormBuilder,
    private readonly actveRouter: ActivatedRoute,
    private readonly toastService: ToastrService,
    @Inject(LOCALE_ID) public locale: string 
  ){
    this.actveRouter.queryParams.subscribe(params => {
      this.cliente = params as Cliente;
    })

    this.clientFormGroup.controls["confirmaSenha"].addValidators(confirmarSenha(this.clientFormGroup));
    this.clientFormGroup.controls["inscricaoEstadual"].addValidators(confirmaInscricaoEstadual(this.clientFormGroup));
    this.clientFormGroup.controls["dataNascimento"].addValidators(validaDataNascimento(this.clientFormGroup));
    this.clientFormGroup.controls["genero"].addValidators(generoObrigatorio(this.clientFormGroup));
    this.clientFormGroup.addValidators(validaPessoaJuridica(this.clientFormGroup));

    // Atualiza o estado do campo quando o checkbox é alterado
    this.clientFormGroup.get('isento')?.valueChanges.subscribe(value => {
      this.isIsento = value as boolean;
      if (this.isIsento) {
        this.clientFormGroup.controls['inscricaoEstadual']?.disable();
      } else {
        this.clientFormGroup.controls['inscricaoEstadual']?.enable();
      }
    });

    this.clientFormGroup.controls["inscricaoEstadual"].valueChanges.subscribe(value => { 
      this.clientFormGroup.controls["inscricaoEstadual"].setErrors({inscricaoEstadualObrigatoria: false})
    })

   
  }

  ngOnInit(): void {
    this.mask();
    this.setFormGroup();
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

  get bloqueado(){
    return this.clientFormGroup.controls["bloqueado"]!;
  }
  get isento(){
    return this.clientFormGroup.get("isento")!;
  }

  cadastrarCliente(){
    if(this.clientFormGroup.valid || this.clientFormGroup.errors?.["pessoaJuridicaValida"]){
      const cliente : Cliente = {
        id: parseInt(this.cliente?.id?.toString() || "0"),
        nome: this.nomeRazaoSocial.value || "",
        email: this.email.value || "",
        telefone: this.telefone.value || "",
        tipoPessoa: parseInt(this.tipoPessoa.value?.toString() || TipoPessoa.Fisica.toString()),
        cpfCnpj: this.cpfCnpj.value || "",
        inscricaoEstadual: this.inscricaoEstadual.value || "",
        dataCadastro: formatDate(new Date(), "YYYY-MM-dd", this.locale),
        genero: this.tipoPessoa.value == TipoPessoa.Fisica? 
          parseInt(this.genero.value?.toString() || Genero.Outros.toString()): 
          Genero.Outros,

        dataNascimento: this.tipoPessoa.value == TipoPessoa.Fisica? 
          this.dataNascimento.value?.toString().split("T")[0] || new Date().toString(): 
          formatDate(new Date().toString(), "yyyy-MM-dd", this.locale),

        senha: this.senha.value || "",
        bloqueado: Boolean(this.bloqueado.value || false), 
        isento: this.tipoPessoa.value == TipoPessoa.Juridica? 
          false: 
          Boolean(this.isento.value || false)
      }
      // if(cliente.id == 0){
      //   this.gravar(cliente);
      // }
      // else{
      //   this.atualizar(cliente);
      // }
      
    }
    
  }

  mask(){
    if (this.clientFormGroup.get("tipoPessoa")?.value == TipoPessoa.Fisica){
      this.mask_cpf_cnpj = "000.000.000-00"
    }
    if (this.clientFormGroup.get("tipoPessoa")?.value == TipoPessoa.Juridica){
      this.clientFormGroup.controls.inscricaoEstadual.enable();
      this.mask_cpf_cnpj = "00.000.000/0000-00";
      this.clientFormGroup.controls["isento"].setValue(false);
      this.inscEstadualPlaceHolder = "000.000.000-000"
    }
    this.clientFormGroup.controls['cpfCnpj'].setValue("");
  }
  clientes(){
    this.router.navigate([""]);
  }

  isentar(event:Event){
    const isento = event?.target as HTMLInputElement;
    if(isento.checked){
      this.clientFormGroup.controls["inscricaoEstadual"].setValue("");
      this.inscEstadualPlaceHolder = "Isento"
    }
    else{
      this.inscEstadualPlaceHolder = "000.000.000-000"
    }
  }

  setFormGroup(){
    if(this.cliente.id){ 
      this.clientFormGroup.controls["nomeRazaoSocial"].setValue(this.cliente.nome);    
      this.clientFormGroup.controls["email"].setValue(this.cliente.email);              
      this.clientFormGroup.controls["telefone"].setValue(this.cliente.telefone);          
      
      this.clientFormGroup.controls["tipoPessoa"].setValue(this.cliente.tipoPessoa);        
      this.clientFormGroup.controls["cpfCnpj"].setValue(this.cliente.cpfCnpj);           
      this.clientFormGroup.controls["inscricaoEstadual"].setValue(this.cliente.inscricaoEstadual);  
      this.clientFormGroup.controls["isento"].setValue(this.cliente.isento);            
      this.clientFormGroup.controls["genero"].setValue(this.cliente.genero);            
      this.clientFormGroup.controls["dataNascimento"].setValue(formatDate(this.cliente.dataNascimento, "yyyy-MM-dd", this.locale));    
      this.clientFormGroup.controls["bloqueado"].setValue(this.cliente.bloqueado);   
    }
  }

  gravar(cliente: Cliente){
    this.clienteService.postCliente(cliente).subscribe({
      next: (success: any) => {
        this.toastService.success("Sucesso", `Cliente cadastrado: ${success.id}`, {timeOut: 5000, closeButton: true})
        this.clientes();
      },
      error: (err: any) =>{
        if(err.status == 400){
          this.toastService.error(err.error.errors[""], "Erro", {timeOut: 5000, closeButton: true});
          return;
        }
        this.toastService.error(err.error,"Erro", {timeOut: 5000, closeButton: true});
      }
    });
  }

  atualizar(cliente: Cliente){
    this.clienteService.putCliente(cliente).subscribe({
      next: (success: any) => {
        this.toastService.success("Sucesso", `Cliente Atualizado: ${success.id}`, {timeOut: 5000, closeButton: true})
        this.clientes();
      },
      error: (err: any) =>{
        if(err.status == 400){
          this.toastService.error(err.error.errors[""], "Erro", {timeOut: 5000, closeButton: true});
          return;
        }
        this.toastService.error(err.error,"Erro", {timeOut: 5000, closeButton: true});
      }
    });
  }

}
