import { Component, OnInit } from "@angular/core";
import { Pokemon } from "../donnees/pokemon";
import { DatePipe, AsyncPipe } from "@angular/common";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { BorderCardDirective } from "../directives/border-card.directive";
import { Router } from "@angular/router";
import { PokemonsService } from "../pokemons.service";
import { SearchPokemonComponent } from "../search-pokemons/search-pokemons.component";
import { FilterPokemonComponent } from "../filter-pokemons/filter-pokemon.component";
import { Subject, BehaviorSubject, combineLatest, switchMap, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { trigger, transition, style, animate, query, stagger } from "@angular/animations";

@Component({
  standalone: true,
  selector: 'list-pokemons',
  templateUrl: './pokemons.component.html',
  imports: [DatePipe, AsyncPipe, PokemonTypeColor, BorderCardDirective, SearchPokemonComponent, FilterPokemonComponent],
  animations: [
    trigger('listeAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(60, [
            animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class PokemonsComponent implements OnInit {

  private pokemons$ = new BehaviorSubject<Pokemon[]>([]);
  private sortCritere$ = new BehaviorSubject<string>('id');
  pokemonsTries$!: Observable<Pokemon[]>;
  private deleteTrigger = new Subject<Pokemon>();

  constructor(private router: Router, private pokemonService: PokemonsService) {}

  ngOnInit(): void {
    this.pokemonService.getPokemons().subscribe(pokemons => {
      this.pokemons$.next(pokemons);
    });

    this.pokemonsTries$ = combineLatest([this.pokemons$, this.sortCritere$]).pipe(
      map(([pokemons, critere]) => this.trier(pokemons, critere))
    );

    this.deleteTrigger.pipe(
      switchMap(pokemon => this.pokemonService.deletePokemon(pokemon))
    ).subscribe((pokemonSupprime: any) => {
      const liste = this.pokemons$.getValue().filter(p => p.id !== pokemonSupprime.id);
      this.pokemons$.next(liste);
    });
  }

  private trier(pokemons: Pokemon[], critere: string): Pokemon[] {
    return [...pokemons].sort((a, b) => {
      switch (critere) {
        case 'name':   return a.name.localeCompare(b.name);
        case 'hp':     return b.hp - a.hp;
        case 'cp':     return b.cp - a.cp;
        case 'rarity': return b.rarity - a.rarity;
        default:       return a.id - b.id;
      }
    });
  }

  trierPar(critere: string): void {
    this.sortCritere$.next(critere);
  }

  selectPokemon(pokemon: Pokemon) {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  addPokemon() {
    this.router.navigate(['/pokemon/add']);
  }

  deletePokemon(event: Event, pokemon: Pokemon) {
    event.stopPropagation();
    this.deleteTrigger.next(pokemon);
  }
}
