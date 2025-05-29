import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';
import { EnterpriseService } from '../../isp/enterprise/enterprise.service';
import { Enterprise } from '../../isp/enterprise/models';



@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  standalone: false
})
export class AuthComponent implements OnInit {
  email: string = '';
  password: string = '';

  initCoords: [number, number] = [0, 0];
  enterprises: Enterprise[] = [];

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService, private router: Router,
    private enterpriseService: EnterpriseService,
    private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.initForm();
    this.getEnterprises();
  }


  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      enterprise_id: ['',],
    });
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, enterprise_id } = this.loginForm.value;
      this.authService.login(email, password, enterprise_id).pipe(

        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('id_user', response.user.id.toString());
          localStorage.setItem('user_name', response.user.name);
          localStorage.setItem('role', response.user.role[0].id.toString());
          localStorage.setItem('enterprise_id', response.enterprise.id.toString());
          localStorage.setItem('enterprise_name', response.enterprise.name.toString());
          this.setEnterprise(response.enterprise.id);
        })
      ).subscribe(
        (response) => {
          this.router.navigate(['/dashboard/home/home']);
        },
        (error) => {
          this.msgSusscess("Credenciales incorrectas o su cuenta ha sido desactivada");
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

  setEnterprise(id: number) {
    this.enterpriseService.getEnterpriseByID(id).subscribe((respuesta) => {
      this.initCoords = respuesta?.city.coordinates
      localStorage.setItem('coords', JSON.stringify(this.initCoords));
    })
  }


  getEnterprises() {
    this.enterpriseService.getEnterprises().subscribe(stores => {
      if (stores.data.length > 0) {
        this.enterprises = stores.data;
      }
    })
  }

}
