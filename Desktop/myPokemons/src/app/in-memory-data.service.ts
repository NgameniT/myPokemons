import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { POKEMONS } from './pokemons/donnees/mock-pokemons';
import { Observable } from 'rxjs';

export class InMemoryDataService implements InMemoryDbService{
  createDb(){
    let pokemons = POKEMONS;
    return { pokemons }
  }
}