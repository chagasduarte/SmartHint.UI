import { Component, OnInit } from '@angular/core';
import DataTable from 'datatables.net-dt';
import { Cliente } from '../../models/cliente';
import { IClienteServce } from '../../interfaces/IClienteService';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compradores',
  standalone: true,
  imports: [],
  templateUrl: './compradores.component.html',
  styleUrl: './compradores.component.css'
})
export class CompradoresComponent implements OnInit{
 
  clientes!: Cliente[];
  
  constructor(
    private readonly clienteService: ClienteService,
    private readonly router: Router
  ){}
  
  ngOnInit(): void {
    this.clienteService.getCliente().subscribe({
      next: (success: Cliente[]) => {
        this.clientes = success;
      }
    });
  }

  edicao(cli: Cliente){
    this.router.navigate(["edicao"], { queryParams: cli  as Cliente});
  }
  
}