import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { Pokemon } from "../donnees/pokemon";
import { PokemonsService } from "../pokemons.service";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { PokemonRarity } from "../pipes/pokemon-rarity.pipe";

@Component({
  standalone: true,
  selector: 'compare-pokemon',
  templateUrl: './compare-pokemon.component.html',
  imports: [AsyncPipe, PokemonTypeColor, PokemonRarity]
})
export class ComparePokemonComponent implements OnInit {

  pokemons: Pokemon[] = [];
  private selectionSubject = new BehaviorSubject<Pokemon[]>([]);
  selection$: Observable<Pokemon[]> = this.selectionSubject.asObservable();

  constructor(private router: Router, private pokemonsService: PokemonsService){}

  ngOnInit(): void {
    this.pokemonsService.getPokemons().subscribe(pokemons => {
      this.pokemons = pokemons;
    });
  }

  toggleSelection(pokemon: Pokemon): void {
    const selection = this.selectionSubject.value;
    const dejaSelectionne = selection.findIndex(p => p.id === pokemon.id);
    if(dejaSelectionne > -1){
      this.selectionSubject.next(selection.filter(p => p.id !== pokemon.id));
    } else if(selection.length < 2){
      this.selectionSubject.next([...selection, pokemon]);
    }
  }

  isSelected(pokemon: Pokemon): boolean {
    return this.selectionSubject.value.some(p => p.id === pokemon.id);
  }

  isDisabled(pokemon: Pokemon): boolean {
    return this.selectionSubject.value.length >= 2 && !this.isSelected(pokemon);
  }

  goBack(): void {
    this.router.navigate(['/pokemon/all']);
  }
}
