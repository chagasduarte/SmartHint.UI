import { Component, OnInit } from '@angular/core';
import DataTable from 'datatables.net-dt';
import { Cliente } from '../../models/cliente';
import { IClienteServce } from '../../interfaces/IClienteService';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { ClientePage } from '../../models/cliente-page';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-compradores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compradores.component.html',
  styleUrl: './compradores.component.css'
})
export class CompradoresComponent implements OnInit{
 
  clientes!: ClientePage;
  pageNumber: number = 1;
  pageSize: number = 3;

  clientFormGroup = new FormGroup({
    nomeRazaoSocial: new FormControl(require),
  });


  constructor(
    private readonly clienteService: ClienteService,
    private readonly router: Router
  ){}
  
  ngOnInit(): void {
    this.getClientesPerPage(this.pageNumber, this.pageSize);
  }

  getClientesPerPage(page: number, size:number){
    this.clienteService.getCliente(page, size).subscribe({
      next: (success: ClientePage) => {
        this.clientes = success;
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
  
}