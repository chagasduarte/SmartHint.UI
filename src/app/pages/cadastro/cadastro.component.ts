import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TipoPessoa } from '../../models/enums/tipoPessoa';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

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

  clientFormGroup = new FormGroup({
    //principal
    nomeRazaoSocial: new FormControl("",Validators.required),
    email: new FormControl("",[Validators.email,Validators.required]),
    telefone: new FormControl("",Validators.required),

    //pessoal
    tipoPessoa: new FormControl(TipoPessoa.Fisica, Validators.required),
    cpfCnpj: new FormControl("",[Validators.required]),
    inscricaoEstadual: new FormControl("",Validators.required),
  });

  constructor(
    private readonly router:Router,
    private readonly clienteService: ClienteService
  ){}
  
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

  cadastrarCliente(){
    if(this.clientFormGroup.valid){
      const cliente : Cliente = {
        id: 0,
        nome: this.clientFormGroup.get("nomeRazaoSocial")?.value || "",
        email: this.clientFormGroup.get("email")?.value || "",
        telefone: this.clientFormGroup.get("telefone")?.value || "",
        tipoPessoa: this.clientFormGroup.get("tipoPessoa")?.value || TipoPessoa.Fisica,
        cpfCnpj: this.clientFormGroup.get("cpfCnpj")?.value || "",
        inscricaoEstadual: this.clientFormGroup.get("inscricaoEstadual")?.value || "",
        dataCadastro: new Date()
      }
      this.clienteService.postCliente(cliente).subscribe({
        next: (success: any) => {
          console.log(success);
        }
      });
      this.router.navigate([""]);
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
}
