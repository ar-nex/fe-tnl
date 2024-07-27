import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {path: "", component: HomeComponent},
    {   path: "dashboard",
        loadComponent: () => import('./dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: "login",
        loadComponent: () => import('./login/login.component')
        .then(m => m.LoginComponent)
    }
];
