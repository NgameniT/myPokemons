import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { trigger, transition, style, animate, query } from '@angular/animations';

// Animation de transition entre les pages (tâche 16)
// query(':enter') cible la page qui arrive, :leave celle qui part
const pageTransition = trigger('pageTransition', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(24px)' }),
      animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ], { optional: true })
  ])
]);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [pageTransition]
})
export class App {
  protected readonly title = signal('myPokemons');

  constructor(private authService: AuthService, private router: Router) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUser(): any {
    return this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Retourne l'URL courante pour servir d'état à l'animation de route
  get routeState(): string {
    return this.router.url;
  }
}
