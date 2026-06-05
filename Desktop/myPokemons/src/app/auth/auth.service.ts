import { Injectable } from "@angular/core";
import { Observable, from, of } from "rxjs";
import { tap, catchError } from "rxjs";
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

  saveSession(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}
