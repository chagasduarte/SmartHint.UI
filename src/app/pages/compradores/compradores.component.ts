import { Component, OnInit } from '@angular/core';
import DataTable from 'datatables.net-dt';
import { Cliente } from '../../models/cliente';
import { IClienteServce } from '../../interfaces/IClienteService';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-compradores',
  standalone: true,
  imports: [],
  templateUrl: './compradores.component.html',
  styleUrl: './compradores.component.css'
})
export class CompradoresComponent implements OnInit{
[x: string]: any;
  
  clientes!: Cliente[];
  
  constructor(private readonly clienteService: ClienteService){}
  
  ngOnInit(): void {
    this.clienteService.getCliente().subscribe({
      next: (success: Cliente[]) => {
        this.clientes = success;
      }
    });
  }


  
}