import { Routes } from '@angular/router';
import { Index } from './pages/index';
import { Datos } from './pages/datos/datos';
import { Historias } from './pages/historias/historias';
import { Formulario } from './pages/formulario/formulario';
import { Juego } from './pages/juego/juego';
import { authGuard } from './guards/auth-guard';
import { HistoriasSensibles } from './pages/historias-sensibles/historias-sensibles';

export const routes: Routes = [
    {path: '', component: Index},
    {path: 'datos', component: Datos},
    {path: 'historias', component: Historias},
    {path: 'historias-sensibles', component: HistoriasSensibles},
    {path: 'formulario', component: Formulario},
    { path: 'juego', component: Juego, canActivate: [authGuard] },
    {path: '**', redirectTo: '', pathMatch: 'full'},
];
