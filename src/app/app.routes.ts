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
    },
    {
        path: "client/new",
        loadComponent: () => import('./client/add-client/add-client.component')
        .then(m => m.AddClientComponent),
        canActivate: [authGuard]
    },
    {
        path: "client/search",
        loadComponent: () => import('./client/search-client/search-client.component')
        .then(m => m.SearchClientComponent),
        canActivate: [authGuard]
    },
];
