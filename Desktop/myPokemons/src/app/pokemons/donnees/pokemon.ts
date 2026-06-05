export class Pokemon{

  id: number;
  hp: number;
  cp: number;
  name: string;
  picture: string;
  types: Array<string>;
  rarity: number;
  isFavorite: boolean;
  created: Date;

  constructor(){
    this.id = 0;
    this.hp = 0;
    this.cp = 0;
    this.name = "NoName";
    this.picture = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png";
    this.types = ['plante'];
    this.rarity = 1;
    this.isFavorite = false;
    this.created = new Date();

  }
}