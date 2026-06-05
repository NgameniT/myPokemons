import { Component, OnInit } from "@angular/core";
import { Pokemon } from "../donnees/pokemon";
import { DatePipe } from "@angular/common";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { PokemonRarity } from "../pipes/pokemon-rarity.pipe";
import { BorderCardDirective } from "../directives/border-card.directive";
import { Router } from "@angular/router";
import { PokemonsService } from "../pokemons.service";

@Component({
  standalone: true,
  selector: 'favorites-pokemon',
  templateUrl: './favorites-pokemon.component.html',
  imports: [DatePipe, PokemonTypeColor, PokemonRarity, BorderCardDirective]
})
export class FavoritesPokemonComponent implements OnInit {

  pokemons: Pokemon[] = [];

  constructor(private router: Router, private pokemonsService: PokemonsService){}

  ngOnInit(): void {
    this.pokemonsService.getFavoritePokemons().subscribe(pokemons => {
      this.pokemons = pokemons;
    });
  }

  selectPokemon(pokemon: Pokemon): void {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  goBack(): void {
    this.router.navigate(['/pokemon/all']);
  }

}
