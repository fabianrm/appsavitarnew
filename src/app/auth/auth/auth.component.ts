import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  email: string = '';
  password: string = '';

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }


  ngOnInit(): void {
    this.initForm();
  }



  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (response) => {
          console.log(response);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard/customer/customers']);
        },
        (error) => {
          console.error(error);
          alert('Credenciales incorrectas.');
        }
      );
    }
  }


  login() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log(response);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error(error);
        alert('Credenciales incorrectas.');
      }
    );
    // this.router.navigateByUrl('/dashboard/customer/customers')
  }


}
