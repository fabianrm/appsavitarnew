import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  email: string = '';
  password: string = '';

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService:
      AuthService, private router: Router,
    private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.initForm();
  }


  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // onSubmit(): void {
  //   if (this.loginForm.valid) {
  //     const { email, password } = this.loginForm.value;
  //     this.authService.login(email, password).subscribe(
  //       (response) => {
  //         console.log(response);
  //         localStorage.setItem('token', response.token);
  //         this.router.navigate(['/dashboard/customer/customers']);
  //       },
  //       (error) => {
  //         this.msgSusscess('Credenciales incorrectas')
  //         console.error(error);
  //         //alert('Credenciales incorrectas.');
  //       }
  //     );
  //   }
  // }


  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
        })
      ).subscribe(
        (response) => {
         // console.log(response);
          this.router.navigate(['/dashboard/home/home']);
        },
        (error) => {
          this.msgSusscess('Credenciales incorrectas');
          console.error(error);
          // alert('Credenciales incorrectas.');
        }
      );
    }
  }
  
  msgSusscess(mensaje: string) {
    this._snackBar.open(mensaje, 'SAVITAR', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

}
