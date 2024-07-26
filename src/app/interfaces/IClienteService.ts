import { Observable } from "rxjs";
import { Cliente } from "../models/cliente";

export interface IClienteServce {
    getCliente() : Observable<Cliente>;
}