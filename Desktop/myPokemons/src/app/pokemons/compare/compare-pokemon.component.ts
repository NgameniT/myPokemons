import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { Pokemon } from "../donnees/pokemon";
import { PokemonsService } from "../pokemons.service";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { PokemonRarity } from "../pipes/pokemon-rarity.pipe";

// BehaviorSubject = Subject qui mémorise la dernière valeur émise
// Tout abonné reçoit immédiatement la valeur courante sans attendre un .next()
// Idéal pour gérer un état réactif (ici : la liste des pokémons sélectionnés)

@Component({
  standalone: true,
  selector: 'compare-pokemon',
  templateUrl: './compare-pokemon.component.html',
  imports: [AsyncPipe, PokemonTypeColor, PokemonRarity]
})
export class ComparePokemonComponent implements OnInit {

  pokemons: Pokemon[] = [];

  // BehaviorSubject initialisé avec un tableau vide (aucune sélection au départ)
  private selectionSubject = new BehaviorSubject<Pokemon[]>([]);

  // Observable public que le template consomme via | async
  selection$: Observable<Pokemon[]> = this.selectionSubject.asObservable();

  constructor(private router: Router, private pokemonsService: PokemonsService){}

  ngOnInit(): void {
    this.pokemonsService.getPokemons().subscribe(pokemons => {
      this.pokemons = pokemons;
    });
  }

  // Ajoute ou retire un pokémon de la sélection
  toggleSelection(pokemon: Pokemon): void {
    const selection = this.selectionSubject.value;
    const dejaSelectionne = selection.findIndex(p => p.id === pokemon.id);

    if(dejaSelectionne > -1){
      // Pokémon déjà dans la sélection : on le retire
      this.selectionSubject.next(selection.filter(p => p.id !== pokemon.id));
    } else if(selection.length < 2){
      // Moins de 2 sélectionnés : on l'ajoute
      this.selectionSubject.next([...selection, pokemon]);
    }
  }

  // Vérifie si un pokémon est dans la sélection courante
  isSelected(pokemon: Pokemon): boolean {
    return this.selectionSubject.value.some(p => p.id === pokemon.id);
  }

  // Désactive un pokémon si 2 sont déjà sélectionnés et qu'il n'en fait pas partie
  isDisabled(pokemon: Pokemon): boolean {
    return this.selectionSubject.value.length >= 2 && !this.isSelected(pokemon);
  }

  goBack(): void {
    this.router.navigate(['/pokemon/all']);
  }
}
