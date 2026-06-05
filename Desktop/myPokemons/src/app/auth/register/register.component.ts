import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

// Validateur personnalisé : vérifie que mot de passe et confirmation correspondent
function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm  = control.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordsMismatch: true };
}

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [ReactiveFormsModule]
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordsMatch });
  }

  get email()           { return this.registerForm.get('email'); }
  get password()        { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  onSubmit(): void {
    const { email, password } = this.registerForm.value;

    this.authService.register(email, password).subscribe(user => {
      if(user){
        this.successMessage = 'Inscription réussie ! Vous pouvez vous connecter.';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      } else {
        this.errorMessage = 'Cet email est déjà utilisé.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
