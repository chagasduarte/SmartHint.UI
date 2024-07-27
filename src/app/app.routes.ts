import { Routes } from '@angular/router';
import { CompradoresComponent } from './pages/compradores/compradores.component';
import { EdicaoComponent } from './pages/edicao/edicao.component';
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
        path:"edicao",
        component: EdicaoComponent
    },
    {
        path: "cadastro",
        component: CadastroComponent
    }
];
