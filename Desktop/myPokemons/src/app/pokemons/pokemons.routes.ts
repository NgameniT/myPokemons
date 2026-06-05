import { Routes } from "@angular/router";
import { PokemonsComponent } from './list/pokemons.component';
import { DetailPokemonComponent } from './detail/detail-pokemon.component';
import { EditPokemonComponent } from './edit/edit-pokemon.component';
import { AddPokemonComponent } from './add/add-pokemon.component';
import { FavoritesPokemonComponent } from './favorites/favorites-pokemon.component';
import { ComparePokemonComponent } from './compare/compare-pokemon.component';

export const pokemonsRoutes: Routes = [
  { path: 'all',       loadComponent: () => PokemonsComponent },
  { path: 'add',       loadComponent: () => AddPokemonComponent },
  { path: 'favorites', loadComponent: () => FavoritesPokemonComponent },
  { path: 'compare',   loadComponent: () => ComparePokemonComponent },
  { path: 'edit/:id',  loadComponent: () => EditPokemonComponent },
  { path: ':id',       loadComponent: () => DetailPokemonComponent },
]