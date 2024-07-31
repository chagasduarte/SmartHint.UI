import { Routes } from '@angular/router';
import { CompradoresComponent } from './pages/compradores/compradores.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';

export const routes: Routes = [
    {
        path:"",
        component: CompradoresComponent
    },
    {
        path:"clientes",
        component: CadastroComponent
    },
    {
        path: "cadastro",
        component: CadastroComponent
    }
];
