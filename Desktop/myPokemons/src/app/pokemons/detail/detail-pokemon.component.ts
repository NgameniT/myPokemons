import { Component, OnInit } from "@angular/core";
import { Pokemon } from "../donnees/pokemon";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { PokemonRarity } from "../pipes/pokemon-rarity.pipe";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { PokemonsService } from "../pokemons.service";
import { Subject, switchMap } from "rxjs";

@Component({
  standalone: true,
  selector: 'detail-Pokemon',
  templateUrl: 'detail-pokemon.component.html',
  imports: [PokemonTypeColor, PokemonRarity, DatePipe]
})
export class DetailPokemonComponent implements OnInit{

  pokemon: any = null;
  private pokemonIds: number[] = [];
  private navigationSubject = new Subject<number>();

  constructor(private route: ActivatedRoute, private router: Router,
              private pokemonsService: PokemonsService
              ){}

  ngOnInit(): void {
    const idInitial = Number(this.route.snapshot.params['id']);

    this.navigationSubject.pipe(
      switchMap(id => this.pokemonsService.getPokemon(id))
    ).subscribe(pokemon => {
      this.pokemon = pokemon;
      this.router.navigate(['/pokemon', pokemon.id], { replaceUrl: true });
    });

    this.pokemonsService.getPokemons().subscribe(pokemons => {
      this.pokemonIds = pokemons.map(p => p.id);
    });

    this.navigationSubject.next(idInitial);
  }

  private get currentIndex(): number {
    return this.pokemonIds.indexOf(this.pokemon?.id);
  }

  get previousId(): number | null {
    return this.currentIndex > 0 ? this.pokemonIds[this.currentIndex - 1] : null;
  }

  get nextId(): number | null {
    return this.currentIndex < this.pokemonIds.length - 1
      ? this.pokemonIds[this.currentIndex + 1]
      : null;
  }

  goPrevious(): void {
    if(this.previousId) this.navigationSubject.next(this.previousId);
  }

  goNext(): void {
    if(this.nextId) this.navigationSubject.next(this.nextId);
  }

  toggleFavorite(): void {
    this.pokemonsService.toggleFavorite(this.pokemon).subscribe();
  }

  goBack(){
    this.router.navigate(['/']);
  }

  goEdit(pokemon: Pokemon){
    let link = ['/pokemon/edit', pokemon.id];
    this.router.navigate(link);
  }
}
