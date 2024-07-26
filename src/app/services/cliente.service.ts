import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Cliente } from '../models/cliente';
import { Observable } from 'rxjs';
import { IClienteServce } from '../interfaces/IClienteService';

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

    getCliente() : Observable<Cliente[]>{
      return this.http.get<Cliente[]>(`${this.WebApi}/Cliente`);
    }
}
