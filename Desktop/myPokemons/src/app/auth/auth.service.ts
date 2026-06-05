import { Injectable } from "@angular/core";
import { Observable, from, of } from "rxjs";
import { tap, catchError, map } from "rxjs";
import { SupabaseService } from "../supabase.service";

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private supabaseService: SupabaseService){}

  private get db() {
    return this.supabaseService.client.from('users');
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

  // Inscrit un nouvel utilisateur dans la table users
  register(email: string, password: string): Observable<any>{
    return from(
      this.db.insert([{ email, password }]).select().single()
        .then(({ data, error }) => {
          if(error) throw error;
          return data;
        })
    ).pipe(
      tap(user => this.log(`registered user: ${user?.email}`)),
      catchError(this.handleError('register', null))
    );
  }

  // Vérifie les identifiants et retourne l'utilisateur si trouvé
  login(email: string, password: string): Observable<any>{
    return from(
      this.db.select('*').eq('email', email).eq('password', password).single()
        .then(({ data, error }) => {
          if(error) throw error;
          return data;
        })
    ).pipe(
      tap(user => this.log(`logged in user: ${user?.email}`)),
      catchError(this.handleError('login', null))
    );
  }

  // Sauvegarde l'utilisateur connecté dans le localStorage
  saveSession(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Récupère l'utilisateur connecté
  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}
