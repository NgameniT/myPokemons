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

// Programmation réactive — Tâche 17 : tri réactif
// BehaviorSubject = émet immédiatement sa valeur courante aux nouveaux abonnés
// combineLatest = réémet dès que la liste OU le critère change
// map() = retrie le tableau sans modifier les données sources

@Component({
  standalone: true,
  selector: 'list-pokemons',
  templateUrl: './pokemons.component.html',
  imports: [DatePipe, AsyncPipe, PokemonTypeColor, BorderCardDirective, SearchPokemonComponent, FilterPokemonComponent],
  animations: [
    // Animation d'apparition des cartes en cascade
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

  // BehaviorSubject : source réactive de la liste (mise à jour après suppression)
  private pokemons$ = new BehaviorSubject<Pokemon[]>([]);

  // BehaviorSubject : critère de tri courant, 'id' par défaut
  private sortCritere$ = new BehaviorSubject<string>('id');

  // Observable combiné exposé au template via | async
  pokemonsTries$!: Observable<Pokemon[]>;

  // Subject = déclencheur du flux réactif de suppression
  private deleteTrigger = new Subject<Pokemon>();

  constructor(private router: Router, private pokemonService: PokemonsService) {}

  ngOnInit(): void {
    // Chargement initial : on pousse la liste dans le BehaviorSubject
    this.pokemonService.getPokemons().subscribe(pokemons => {
      this.pokemons$.next(pokemons);
    });

    // combineLatest : à chaque changement de liste OU de critère, map() retrie automatiquement
    this.pokemonsTries$ = combineLatest([this.pokemons$, this.sortCritere$]).pipe(
      map(([pokemons, critere]) => this.trier(pokemons, critere))
    );

    // Pipeline réactif pour la suppression
    // switchMap = annule la requête précédente si on clique vite
    this.deleteTrigger.pipe(
      switchMap(pokemon => this.pokemonService.deletePokemon(pokemon))
    ).subscribe((pokemonSupprime: any) => {
      // Mise à jour réactive : on émet une nouvelle liste sans le pokémon supprimé
      const liste = this.pokemons$.getValue().filter(p => p.id !== pokemonSupprime.id);
      this.pokemons$.next(liste);
    });
  }

  // Tri pur sans effet de bord — renvoie un nouveau tableau trié
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

  // Pousse un nouveau critère → combineLatest se réémet → map() retrie
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
    // stopPropagation : empêche le clic de remonter à la carte (qui naviguerait vers le détail)
    event.stopPropagation();
    this.deleteTrigger.next(pokemon);
  }
}
