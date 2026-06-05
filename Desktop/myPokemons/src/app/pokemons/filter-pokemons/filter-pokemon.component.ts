import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Pokemon } from "../donnees/pokemon";
import { PokemonsService } from "../pokemons.service";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { PokemonRarity } from "../pipes/pokemon-rarity.pipe";

// Programmation réactive — même pattern exact que le prof (SearchPokemonComponent) :
// Subject<string> = déclencheur alimenté à chaque frappe
// debounceTime    = attend 200ms après la dernière frappe avant d'agir
// distinctUntilChanged = n'agit pas si la valeur n'a pas changé
// switchMap       = annule la recherche précédente, lance la nouvelle

@Component({
  standalone: true,
  selector: 'filter-pokemon',
  templateUrl: './filter-pokemon.component.html',
  imports: [FormsModule, AsyncPipe, PokemonTypeColor, PokemonRarity]
})
export class FilterPokemonComponent implements OnInit {

  private searchTerms = new Subject<string>();
  pokemons!: Observable<Pokemon[]>;

  constructor(private router: Router, private pokemonsService: PokemonsService){}

  // On pousse le terme dans le Subject à chaque frappe
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.pokemons = this.searchTerms.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term: string) => this.pokemonsService.searchByTypeOrRarity(term))
    );
  }

  goToDetail(pokemon: Pokemon): void {
    this.router.navigate(['/pokemon', pokemon.id]);
  }
}
