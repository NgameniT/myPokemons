import { Component, OnInit } from "@angular/core";
import { Pokemon } from "../donnees/pokemon";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { PokemonRarity } from "../pipes/pokemon-rarity.pipe";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { PokemonsService } from "../pokemons.service";
import { Subject, switchMap } from "rxjs";

// Programmation réactive :
// Subject<number> = déclencheur — on y pousse l'id du pokémon à afficher
// switchMap = annule le chargement précédent et charge le nouveau pokémon
// Même pattern que le prof : Subject + pipe(switchMap) + .next()

@Component({
  standalone: true,
  selector: 'detail-Pokemon',
  templateUrl: 'detail-pokemon.component.html',
  imports: [PokemonTypeColor, PokemonRarity, DatePipe]
})
export class DetailPokemonComponent implements OnInit{

  pokemon: any = null;
  private pokemonIds: number[] = [];

  // Subject = déclencheur de navigation (suivant / précédent)
  private navigationSubject = new Subject<number>();

  constructor(private route: ActivatedRoute, private router: Router,
              private pokemonsService: PokemonsService
              ){}

  ngOnInit(): void {
    // Lecture de l'id initial depuis l'URL
    const idInitial = Number(this.route.snapshot.params['id']);

    // Pipeline réactif : chaque .next(id) dans navigationSubject
    // déclenche switchMap qui charge le pokémon correspondant
    this.navigationSubject.pipe(
      switchMap(id => this.pokemonsService.getPokemon(id))
    ).subscribe(pokemon => {
      this.pokemon = pokemon;
      // On met à jour l'URL sans recréer le composant
      this.router.navigate(['/pokemon', pokemon.id], { replaceUrl: true });
    });

    // Charge tous les ids pour calculer suivant/précédent
    this.pokemonsService.getPokemons().subscribe(pokemons => {
      this.pokemonIds = pokemons.map(p => p.id);
    });

    // On pousse l'id initial dans le Subject pour démarrer le flux
    this.navigationSubject.next(idInitial);
  }

  // Index du pokémon courant dans la liste
  private get currentIndex(): number {
    return this.pokemonIds.indexOf(this.pokemon?.id);
  }

  // Id du pokémon précédent (null si premier)
  get previousId(): number | null {
    return this.currentIndex > 0 ? this.pokemonIds[this.currentIndex - 1] : null;
  }

  // Id du pokémon suivant (null si dernier)
  get nextId(): number | null {
    return this.currentIndex < this.pokemonIds.length - 1
      ? this.pokemonIds[this.currentIndex + 1]
      : null;
  }

  // On pousse le nouvel id dans le Subject => déclenche le pipeline
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
