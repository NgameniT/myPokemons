import { Component, OnInit, Input } from "@angular/core";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { PokemonRarity } from "../pipes/pokemon-rarity.pipe";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { PokemonsService } from "../pokemons.service";

@Component({
  standalone: true,
  selector: 'form-pokemon',
  templateUrl: './form-pokemon.component.html',
  imports: [PokemonTypeColor, PokemonRarity, FormsModule]
})
export class FormPokemonComponent implements OnInit{

  @Input() pokemon: any
  
  types: any = [];

  constructor(private router: Router, private pokemonsService: PokemonsService){
    this.types = this.pokemonsService.getPokemonTypes();
  }

  ngOnInit(): void {

  }


  // 1 - Détermine si le type passé en paramètres appartient ou non au pokémon en cours d'édition
  hasType(type:string):boolean{
    let index = this.pokemon.types.indexOf(type);
    return (index > -1);
    
  }
  
  // 2 - Permet au joueur d'ajouter ou retirer un type au pokémon en cours d'attente
  selectType($event: any, type:string):void
  {
    let checked = $event.target.checked;

    if(checked){
      this.pokemon.types.push(type)
    }else{
      let index = this.pokemon.types.indexOf(type);
      if(index > -1){
        this.pokemon.types.splice(index, 1);
      }
    }
  }

  // 3 - Valide le nombre de type pour chaque pokémon
  isTypesValid(type: string):boolean
  {
    if(this.pokemon.types.length === 1 && this.hasType(type)){ 
      return false;
    }

    if(this.pokemon.types.length >= 3 && !this.hasType(type)){
      return false;
    }

    return true
  }

  

  onSubmit(){

    this.pokemonsService.updatePokemon(this.pokemon).subscribe( () => 
      this.router.navigate(['pokemon', this.pokemon.id])
    )

    let link= ['pokemon', this.pokemon.id];
    this.router.navigate(link);
  }

  goBack(){
    let link= ['pokemon', this.pokemon.id];
    this.router.navigate(link);
  }

}