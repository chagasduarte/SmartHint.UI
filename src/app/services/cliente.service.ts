import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Cliente } from '../models/cliente';
import { Observable } from 'rxjs';
import { IClienteServce } from '../interfaces/IClienteService';
import { ClientePage } from '../models/cliente-page';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private WebApi!: string;

  constructor(
    private readonly http: HttpClient,
    private readonly config: ConfigService) {
      this.WebApi = config.get().WebApi;
    }

    getCliente(page: number, size: number) : Observable<ClientePage>{
      return this.http.get<ClientePage>(`${this.WebApi}/Cliente?PageNumber=${page}&PageSize=${size}`);
    }
    postCliente(cliente: Cliente){
      return this.http.post(`${this.WebApi}/Cliente`, cliente);
    }
}
