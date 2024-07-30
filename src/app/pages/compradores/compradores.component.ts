import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../shared/services/cliente.service';
import { Router } from '@angular/router';
import { ClientePage } from '../../models/cliente-page';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PhonePipe } from '../../shared/pipe/phone.pipe';

@Component({
  selector: 'app-compradores',
  standalone: true,
  imports: [
    CommonModule, 
    PhonePipe, 
    ReactiveFormsModule],
  templateUrl: './compradores.component.html',
  styleUrl: './compradores.component.css'
})
export class CompradoresComponent implements OnInit{

 
  clientes!: ClientePage;
  pageNumber: number = 1;
  pageSize: number = 20;
  todosMarcados: boolean = false;
  parcialmenteMarcado: boolean = false;

  formGroup = new FormGroup({});

  constructor(
    private readonly clienteService: ClienteService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder
  ){}

  get formArray()
  {
    return this.formGroup.get("formArray")!;
  }   
  
  ngOnInit(): void {
    this.getClientesPerPage(this.pageNumber, this.pageSize);
  }

  getClientesPerPage(page: number, size:number){
    this.clienteService.getCliente(page, size).subscribe({
      next: (success: ClientePage) => {
        this.clientes = success;
        this.formGroup.addControl("formArray", this.buildCompradoresCheckbox(this.clientes.items))
      },
      error: (err: any) => {
      }
    });
  }
  
  edicao(cli: Cliente){
    this.router.navigate(["edicao"], { queryParams: cli  as Cliente});
  }

  cadastro(){
    this.router.navigate(["cadastro"]);
  }

  changePage(inc: number){
    this.getClientesPerPage(this.clientes.currentPage + inc, this.clientes.pageSize);
  }

  buildCompradoresCheckbox(clientes: Cliente[]): FormArray {
     const values = clientes.map(c => new FormControl(false));
     return this.formBuilder.array(values);
  }
  update(event?: Event) {
    if(event){
      const todos = event?.target as HTMLInputElement;
      this.updateAll(todos.checked);
      return;
    } 

    const control = this.formGroup.get('formArray');
    let v = 0;
    let f = 0;
    if (control && control instanceof FormArray) {
      const formArray = control as FormArray;

      for(let i = 0; i < formArray.value.length; i++){
        if(formArray.value[i] == false){
          f++;
        }
        else {
          v++;
        }
      }
    } 
    if (f > 0 && v > 0){
      this.parcialmenteMarcado = true;
      this.todosMarcados = false;
    }
    if (f == 0) {
      this.todosMarcados = true;
      this.parcialmenteMarcado = false;
    }
    if(v == 0){
      this.todosMarcados = false;
    }
  }
  
  updateAll(value: boolean){
    const control = this.formGroup.get('formArray');
    let formArray!: FormArray;
    if (control && control instanceof FormArray) {
      formArray = control as FormArray;
    }

    let newValues: Boolean[] = [];
    for(let i = 0; i < formArray.length; i++){
      newValues.push(value);
    }

    newValues.forEach((value, index) => {
      if (formArray.at(index)) {
        formArray.at(index).setValue(value);
      }
    });
  }
  
}