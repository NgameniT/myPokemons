import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pokemonRarity', standalone: true })
export class PokemonRarity implements PipeTransform {

  // Transforme un nombre (1-5) en étoiles colorées via des classes CSS
  // 1-2 étoiles => Bronze, 3-4 étoiles => Argent, 5 étoiles => Or
  transform(rarity: number): string {
    const etoiles = '★'.repeat(rarity) + '☆'.repeat(5 - rarity);

    let cssClass: string;
    if (rarity <= 2) {
      cssClass = 'rarity-bronze';
    } else if (rarity <= 4) {
      cssClass = 'rarity-silver';
    } else {
      cssClass = 'rarity-gold';
    }

    return `<span class="${cssClass}">${etoiles}</span>`;
  }
}
