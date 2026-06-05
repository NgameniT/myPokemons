import { Injectable } from "@angular/core";
import { Pokemon } from "./donnees/pokemon";
import { Observable, from, of } from "rxjs";
import { map, tap, catchError } from "rxjs";
import { SupabaseService } from "../supabase.service";

@Injectable({ providedIn: 'root' })
export class PokemonsService {

  constructor(private supabaseService: SupabaseService){}

  private get db() {
    return this.supabaseService.client.from('pokemons');
  }

  private log(message: string){
    console.info(message);
  }

  private handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  private mapPokemon(data: any): Pokemon {
    return { ...data, created: new Date(data.created) } as Pokemon;
  }

  getPokemons(): Observable<Pokemon[]>{
    return from(
      this.db.select('*').order('id').then(({ data, error }) => {
        if(error) throw error;
        return (data || []).map((p: any) => this.mapPokemon(p));
      })
    ).pipe(
      tap(pokemons => this.log(`fetched ${pokemons.length} pokemons`)),
      catchError(this.handleError<Pokemon[]>('getPokemons', []))
    );
  }

  getPokemon(id: number): Observable<Pokemon>{
    return from(
      this.db.select('*').eq('id', id).single().then(({ data, error }) => {
        if(error) throw error;
        return this.mapPokemon(data);
      })
    ).pipe(
      tap(p => this.log(`fetched pokemon id=${p?.id}`)),
      catchError(this.handleError<Pokemon>(`getPokemon id=${id}`))
    );
  }

  getPokemonTypes(): string[]{
    return ['Plante', 'Feu', 'Eau', 'Poison', 'Psy', 'Electrik', 'Normal', 'Fée', 'Vol', 'Insecte'];
  }

  updatePokemon(pokemon: Pokemon): Observable<Pokemon>{
    const { id, ...fields } = pokemon as any;
    return from(
      this.db.update(fields).eq('id', id).select().single().then(({ data, error }) => {
        if(error) throw error;
        return this.mapPokemon(data);
      })
    ).pipe(
      tap(_ => this.log(`updated pokemon id=${id}`)),
      catchError(this.handleError<Pokemon>(`updatePokemon id=${id}`))
    );
  }

  deletePokemon(pokemon: Pokemon): Observable<Pokemon>{
    return from(
      this.db.delete().eq('id', pokemon.id).then(({ error }) => {
        if(error) throw error;
        return pokemon;
      })
    ).pipe(
      tap(_ => this.log(`deleted pokemon id=${pokemon.id}`)),
      catchError(this.handleError<Pokemon>('deletePokemon'))
    );
  }

  addPokemon(pokemon: Pokemon): Observable<Pokemon>{
    const { id, ...fields } = pokemon as any;
    return from(
      this.db.insert([fields]).select().single().then(({ data, error }) => {
        if(error) throw error;
        return this.mapPokemon(data);
      })
    ).pipe(
      tap(p => this.log(`added pokemon id=${p?.id}`)),
      catchError(this.handleError<Pokemon>('addPokemon'))
    );
  }

  toggleFavorite(pokemon: Pokemon): Observable<Pokemon>{
    pokemon.isFavorite = !pokemon.isFavorite;
    return this.updatePokemon(pokemon).pipe(
      tap(_ => this.log(`toggled favorite pokemon id=${pokemon.id}`))
    );
  }

  getFavoritePokemons(): Observable<Pokemon[]>{
    return this.getPokemons().pipe(
      map(pokemons => pokemons.filter(p => p.isFavorite))
    );
  }

  searchPokemons(term: string): Observable<Pokemon[]>{
    if(!term.trim()) return of([]);
    return this.getPokemons().pipe(
      map(pokemons => pokemons.filter(p =>
        p.name.toLowerCase().includes(term.toLowerCase())
      ))
    );
  }

  searchByTypeOrRarity(term: string): Observable<Pokemon[]>{
    if(!term.trim()) return of([]);
    return this.getPokemons().pipe(
      map(pokemons => pokemons.filter(p => {
        const matchType   = p.types.some((t: string) => t.toLowerCase().includes(term.toLowerCase()));
        const matchRarity = p.rarity === Number(term);
        return matchType || matchRarity;
      }))
    );
  }
}
