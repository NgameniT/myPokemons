import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, switchMap } from "rxjs";
import { Pokemon } from "../donnees/pokemon";
import { PokemonsService } from "../pokemons.service";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { PokemonRarity } from "../pipes/pokemon-rarity.pipe";

@Component({
  standalone: true,
  selector: 'add-pokemon',
  templateUrl: './add-pokemon.component.html',
  imports: [ReactiveFormsModule, PokemonTypeColor, PokemonRarity]
})
export class AddPokemonComponent implements OnInit {

  pokemonForm!: FormGroup;
  types: string[] = [];
  private addTrigger = new Subject<Pokemon>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pokemonsService: PokemonsService
  ) {
    this.types = this.pokemonsService.getPokemonTypes();
  }

  ngOnInit(): void {
    this.pokemonForm = this.fb.group({
      name:    ['',   [Validators.required, Validators.pattern('^[a-zA-Zàéèç ]{1,30}$')]],
      hp:      [null, [Validators.required, Validators.min(1), Validators.max(999)]],
      cp:      [null, [Validators.required, Validators.min(1), Validators.max(999)]],
      picture: ['',   [Validators.required, Validators.pattern('^https?://.+')]],
      rarity:  [1,    [Validators.required, Validators.min(1), Validators.max(5)]],
      types:   [[]]
    });

    this.addTrigger.pipe(
      switchMap(pokemon => this.pokemonsService.addPokemon(pokemon))
    ).subscribe(newPokemon => {
      this.router.navigate(['/pokemon', newPokemon.id]);
    });
  }

  get name()    { return this.pokemonForm.get('name'); }
  get hp()      { return this.pokemonForm.get('hp'); }
  get cp()      { return this.pokemonForm.get('cp'); }
  get picture() { return this.pokemonForm.get('picture'); }
  get rarity()  { return this.pokemonForm.get('rarity'); }

  hasType(type: string): boolean {
    const types: string[] = this.pokemonForm.get('types')?.value || [];
    return types.indexOf(type) > -1;
  }

  selectType(event: any, type: string): void {
    const checked = event.target.checked;
    const typesControl = this.pokemonForm.get('types');
    const currentTypes: string[] = typesControl?.value || [];
    if (checked) {
      typesControl?.setValue([...currentTypes, type]);
    } else {
      typesControl?.setValue(currentTypes.filter((t: string) => t !== type));
    }
  }

  isTypesValid(type: string): boolean {
    const types: string[] = this.pokemonForm.get('types')?.value || [];
    if (types.length === 1 && this.hasType(type)) return false;
    if (types.length >= 3 && !this.hasType(type)) return false;
    return true;
  }

  onSubmit(): void {
    this.addTrigger.next(this.pokemonForm.value as Pokemon);
  }

  goBack(): void {
    this.router.navigate(['/pokemon/all']);
  }
}
