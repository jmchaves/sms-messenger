import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Messenger } from './messenger/messenger';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { 
    path: 'messenger', 
    component: Messenger,
    canActivate: [authGuard]
  },
];
