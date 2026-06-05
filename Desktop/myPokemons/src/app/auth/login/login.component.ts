import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    // Si déjà connecté, on redirige directement vers la liste
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/pokemon/all']);
    }

    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email()    { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe(user => {
      if(user){
        // Sauvegarde la session et redirige vers la liste
        this.authService.saveSession(user);
        this.router.navigate(['/pokemon/all']);
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect.';
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
