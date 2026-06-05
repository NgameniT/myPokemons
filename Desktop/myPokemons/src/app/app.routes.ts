import { Routes } from '@angular/router';
import { CounterComponent } from './pokemons/counter/counter.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { pokemonsRoutes } from './pokemons/pokemons.routes';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pokemon/all', pathMatch: 'full' },
  { path: 'pokemon', children: pokemonsRoutes },
  { path: 'register', component: RegisterComponent },
  { path: 'login',    component: LoginComponent },
  { path: 'compteur', component: CounterComponent },
  { path: '**', component: PageNotFoundComponent }
];


