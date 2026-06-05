import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PokemonsService } from "../pokemons.service";
import { Observable, Subject, debounceTime, switchMap, distinctUntilChanged } from "rxjs";
import { FormsModule } from "@angular/forms";
import { Pokemon } from "../donnees/pokemon";
import { AsyncPipe } from "@angular/common";

@Component({
  standalone: true,
  selector: 'search-pokemon',
  templateUrl: './search-pokemons.component.html',
  imports: [FormsModule, AsyncPipe]
})
export class SearchPokemonComponent implements OnInit{

  private searchTerms = new Subject<string>();
  pokemons!: Observable<Pokemon[]>

  constructor(private router: Router, private pokemonsService : PokemonsService){}

  search(term: string):void{
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.pokemons = this.searchTerms.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term: string) => this.pokemonsService.searchPokemons(term)),
    ); 
  }

  goToDetail(pokemon: Pokemon){
    const link = ['pokemon', pokemon.id];
    this.router.navigate(link);
  }

}